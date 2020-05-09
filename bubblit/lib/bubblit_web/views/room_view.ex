defmodule BubblitWeb.RoomView do
  use BubblitWeb, :view
  alias BubblitWeb.RoomView

  def render("index.json", %{rooms: rooms}) do
    %{data: render_many(rooms, RoomView, "room.json")}
  end

  def render("show.json", %{room: room}) do
    %{data: render_one(room, RoomView, "room.json")}
  end

  def render("room.json", %{room: room}) do
    room
    # %{room | users: Bubblit.Accounts.get_users(room.users)}
  end
end
