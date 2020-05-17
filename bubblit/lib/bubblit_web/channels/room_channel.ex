defmodule BubblitWeb.RoomChannel do
  use Phoenix.Channel
  alias BubblitWeb.Presence

  require Logger

  def join("room:" <> room_id, _params, socket) do
    user_id = socket.assigns.user_id
    user = socket.assigns.user

    Logger.info("lobby room joined #{room_id} #{inspect(socket)}")

    case Integer.parse(room_id) do
      {room_id, _remainer} ->
        if room_record = Bubblit.Db.get_room(room_id) do
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
        else
          {:error, %{reason: "invalid room_id #{room_id}"}}
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

  # 그냥 메세지 브로드캐스트할때 닉네임 추가했음.
  def handle_in("new_msg", %{"body" => body}, socket) do
    room_id = socket.assigns.room_record.id
    user_id = socket.assigns.user_id
    d = DateTime.utc_now() |> DateTime.to_string()

    Bubblit.Room.Monitor.add_message(room_id, user_id, body)

    broadcast!(socket, "new_msg", %{body: body, user_id: user_id, inserted_at: d})

    {:noreply, socket}
  end

  # type => img_link / media_link / media_current_play / media_is_play
  def handle_in("tab_action", %{"type" => type, "body" => body} = param, socket) do
    room_id = socket.assigns.room_record.id
    user_id = socket.assigns.user_id

    sub_type = Map.get(param, "sub_type", "")
    Bubblit.Room.Monitor.add_tab_action(room_id, user_id, type, sub_type, body)

    broadcast!(socket, "tab_action", %{
      "type" => type,
      sub_type: sub_type,
      body: body,
      user_id: user_id
    })

    {:noreply, socket}
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
