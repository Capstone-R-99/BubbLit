defmodule BubblitWeb.RoomChannel do
  use Phoenix.Channel
  alias BubblitWeb.Presence

  require Logger

  def join("room:" <> _room_name, _params, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    {:ok, _} =
      Presence.track(socket, socket.assigns.user_id, %{
        online_at: inspect(System.system_time(:second))
      })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  # 그냥 메세지 브로드캐스트할때 닉네임 추가했음.
  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast!(socket, "new_msg", %{body: body, nickname: socket.assigns.user.name})

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
