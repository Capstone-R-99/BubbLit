defmodule BubblitWeb.Roomchannel do
  use Phoenix.Channel

  def join("room:" <> room_name, _params, _socket) do
    {:ok, socket}
  end
end
