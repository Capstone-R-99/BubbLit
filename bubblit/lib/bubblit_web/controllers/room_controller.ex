defmodule BubblitWeb.RoomController do
  use BubblitWeb, :controller

  alias Bubblit.BubbleRooms
  alias Bubblit.BubbleRooms.Room

  action_fallback BubblitWeb.FallbackController

  # 전체적으로 권한 체크 필요.

  def index(conn, _params) do
    rooms = Bubblit.Db.list_rooms()
    render(conn, "index.json", rooms: rooms)
  end

  def create(conn, %{"title" => _title} = room_params) do
    with user_id = Plug.Conn.get_session(conn, :current_user_id),
         room_params = Map.put(room_params, "host_user_id", user_id),
         {:ok, %Room{} = room} <- BubbleRooms.create_room(room_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.room_path(conn, :show, room))
      |> render("show.json", room: room)
    end
  end

  def show(conn, %{"id" => id}) do
    room = Bubblit.Db.get_room!(id)
    render(conn, "show.json", room: room)
  end

  def update(conn, %{"id" => id, "room" => room_params}) do
    room = Bubblit.Db.get_room!(id)

    with {:ok, %Room{} = room} <- Bubblit.Db.update_room(room, room_params) do
      render(conn, "show.json", room: room)
    end
  end

  def delete(conn, %{"id" => id}) do
    room = BubbleRooms.get_room!(id)

    with {:ok, %Room{}} <- BubbleRooms.delete_room(room) do
      send_resp(conn, :no_content, "")
    end
  end
end
