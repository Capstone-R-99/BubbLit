defmodule BubblitWeb.RoomChannel do
  use Phoenix.Channel
  alias BubblitWeb.Presence

  require Logger
  require Util

  @restrict_control_action "restrict_control"

  def join("room:" <> room_id, params, socket) do
    user_id = socket.assigns.user_id
    user = socket.assigns.user

    Logger.info("lobby room joined #{room_id} #{inspect(socket)}")

    case Integer.parse(room_id) do
      {room_id, _remainer} ->
        room_record = Bubblit.Db.get_room(room_id)
        pw = Map.get(params, "password", "")

        cond do
          room_record == nil ->
            {:error, %{reason: "invalid room_id #{room_id}"}}

          # 첫 입장때는 비번 치고 들어와야함.
          user_id not in room_record.users and room_record.is_private and
              room_record.room_password != pw ->
            {:error,
             %{reason: "invalid password for #{room_id}. entered:[#{pw}] this room is private."}}

          true ->
            Bubblit.Room.DynamicSupervisor.start_child(room_id)

            case Bubblit.Room.Monitor.get_after_join(room_id, user_id, user) do
              {:ok, after_join_dic} ->
                send(self(), {:after_join, after_join_dic})

                socket =
                  assign(socket, :room_record, room_record)
                  |> assign(:id, inspect(socket.transport_pid))

                Logger.info("user id #{socket.assigns.user_id} joined to room id #{room_id}.")

                {:ok, %{body: "welcome to room_id #{room_id}"}, socket}

              {:error, msg} ->
                {:error, %{reason: "#{msg} in room_id #{room_id}"}}
            end
        end

      :error ->
        {:error, %{reason: "invalid channel name"}}
    end
  end

  def handle_info({:after_join, after_join_dic}, socket) do
    user_id = socket.assigns.user_id
    user = socket.assigns.user

    room_id = socket.assigns.room_record.id

    Logger.info("user id #{user_id} after join to room id #{room_id}.")

    {:ok, _} =
      Presence.track(socket, socket.assigns.user_id, %{
        online_at: inspect(System.system_time(:second))
      })

    push(socket, "presence_state", Presence.list(socket))

    push(socket, "room_after_join", after_join_dic)

    broadcast!(socket, "user_join", %{user_name: user.name, user_id: user_id})

    {:noreply, socket}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    room_id = socket.assigns.room_record.id
    user_id = socket.assigns.user_id
    d = DateTime.utc_now() |> DateTime.to_string()

    Bubblit.Room.Monitor.add_message(room_id, user_id, body)

    broadcast!(socket, "new_msg", %{body: body, user_id: user_id, inserted_at: d})

    {:noreply, socket}
  end

  # type => img_link / media_link / media_share_time / media_is_play
  def handle_in("tab_action", %{"type" => type, "body" => body}, socket) do
    room_record = socket.assigns.room_record
    room_id = socket.assigns.room_record.id
    user_id = socket.assigns.user_id

    cond do
      # 룸 제어상태인데 host 이외의 유저가 명령
      room_record.host_user_id != user_id and Ets.room_control_restricted?(room_id) ->
        {:reply, :error, socket}

      # 룸 제어상태 변경을 host 이외의 유저가 명령
      room_record.host_user_id != user_id and type == @restrict_control_action ->
        {:reply, :error, socket}

      # 룸 제어상태 변경 결과 아무것도 바뀌지 않음
      type == @restrict_control_action and body == "#{Ets.room_control_restricted?(room_id)}" ->
        {:noreply, socket}

      true ->
        # 룸 제어상태 변경에 대한 특수 처리
        if room_record.host_user_id == user_id and type == @restrict_control_action do
          process_restrict_control(room_id, body)
        end

        Bubblit.Room.Monitor.add_tab_action(room_id, user_id, type, body)

        broadcast!(socket, "tab_action", %{
          "type" => type,
          body: "#{body}",
          user_id: user_id
        })

        {:noreply, socket}
    end
  end

  def handle_in("get_room_code", _param, socket) do
    room_id = socket.assigns.room_record.id
    pw = socket.assigns.room_record.room_password

    push(socket, "get_room_code", %{body: "#{room_id}:#{pw}"})

    {:noreply, socket}
  end

  def handle_in("quit_room", _param, socket) do
    room_id = socket.assigns.room_record.id
    user_id = socket.assigns.user_id
    host? = socket.assigns.room_record.host_user_id != user_id

    if host? do
      :ok = Bubblit.Room.Monitor.update_quit_user(room_id, user_id)
      broadcast!(socket, "user_quit", %{body: user_id})
    else
      {:noreply, socket}
    end
  end

  def handle_in("delete_room", _param, socket) do
    room = socket.assigns.room_record
    Bubblit.Db.delete_room(room)

    broadcast!(socket, "kick_from_room", %{})
    push(socket, "delete_room", %{})

    {:stop, :normal, socket}
  end

  defp process_restrict_control(room_id, body) do
    case body do
      "true" ->
        Ets.set_room_control_restricted(room_id)

      _body ->
        Ets.unset_room_control_restricted(room_id)
    end
  end

  intercept ["kick_from_room"]

  def handle_out("kick_from_room", _param, socket) do
    room_id = socket.assigns.room_record.id
    user_id = socket.assigns.user_id
    Util.log("room #{room_id} user#{user_id} kicked")
    push(socket, "delete_room", %{})
    {:stop, :normal, socket}
  end

  # def handle_in("update_step", %{"body" => body}, socket) do
  #   Logger.info("update_step을 받음. 근데 길이가 #{String.length(body)}")
  #   id = socket.assigns.record.id
  #   new_record = Monitor.step_record_update(id, body)
  #   broadcast(socket, "update_step", %{body: new_record[id].step_record})
  #   {:noreply, socket}
  # end

  # def handle_in("click", %{"body" => index}, socket) do
  #   Logger.info("socket #{inspect(socket)} send click #{index}")
  #   broadcast(socket, "click", %{body: index, id: socket.assigns.id})
  #   {:noreply, socket}
  # end
end
