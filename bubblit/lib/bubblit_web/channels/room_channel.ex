defmodule BubblitWeb.Roomchannel do
  use Phoenix.Channel

  def join("room:" <> _room_name, _params, socket) do
    {:ok, socket}
  end
end
