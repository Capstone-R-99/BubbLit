defmodule Bubblit.BubbleRoomsTest do
  use Bubblit.DataCase

  alias Bubblit.BubbleRooms

  describe "bubble_logs" do
    alias Bubblit.BubbleRooms.BubbleLog

    @valid_attrs %{content: "some content", room_id: 42, user_id: 42}
    @update_attrs %{content: "some updated content", room_id: 43, user_id: 43}
    @invalid_attrs %{content: nil, room_id: nil, user_id: nil}

    def bubble_log_fixture(attrs \\ %{}) do
      {:ok, bubble_log} =
        attrs
        |> Enum.into(@valid_attrs)
        |> BubbleRooms.create_bubble_log()

      bubble_log
    end

    test "list_bubble_logs/0 returns all bubble_logs" do
      bubble_log = bubble_log_fixture()
      assert BubbleRooms.list_bubble_logs() == [bubble_log]
    end

    test "get_bubble_log!/1 returns the bubble_log with given id" do
      bubble_log = bubble_log_fixture()
      assert BubbleRooms.get_bubble_log!(bubble_log.id) == bubble_log
    end

    test "create_bubble_log/1 with valid data creates a bubble_log" do
      assert {:ok, %BubbleLog{} = bubble_log} = BubbleRooms.create_bubble_log(@valid_attrs)
      assert bubble_log.content == "some content"
      assert bubble_log.room_id == 42
      assert bubble_log.user_id == 42
    end

    test "create_bubble_log/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = BubbleRooms.create_bubble_log(@invalid_attrs)
    end

    test "update_bubble_log/2 with valid data updates the bubble_log" do
      bubble_log = bubble_log_fixture()

      assert {:ok, %BubbleLog{} = bubble_log} =
               BubbleRooms.update_bubble_log(bubble_log, @update_attrs)

      assert bubble_log.content == "some updated content"
      assert bubble_log.room_id == 43
      assert bubble_log.user_id == 43
    end

    test "update_bubble_log/2 with invalid data returns error changeset" do
      bubble_log = bubble_log_fixture()

      assert {:error, %Ecto.Changeset{}} =
               BubbleRooms.update_bubble_log(bubble_log, @invalid_attrs)

      assert bubble_log == BubbleRooms.get_bubble_log!(bubble_log.id)
    end

    test "delete_bubble_log/1 deletes the bubble_log" do
      bubble_log = bubble_log_fixture()
      assert {:ok, %BubbleLog{}} = BubbleRooms.delete_bubble_log(bubble_log)
      assert_raise Ecto.NoResultsError, fn -> BubbleRooms.get_bubble_log!(bubble_log.id) end
    end

    test "change_bubble_log/1 returns a bubble_log changeset" do
      bubble_log = bubble_log_fixture()
      assert %Ecto.Changeset{} = BubbleRooms.change_bubble_log(bubble_log)
    end
  end

  describe "rooms" do
    alias Bubblit.BubbleRooms.Room

    @valid_attrs %{
      config_value: "some config_value",
      host_name: "some host_name",
      is_anonymous: true,
      is_private: true,
      title: "some title"
    }
    @update_attrs %{
      config_value: "some updated config_value",
      host_name: "some updated host_name",
      is_anonymous: false,
      is_private: false,
      title: "some updated title"
    }
    @invalid_attrs %{
      config_value: nil,
      host_name: nil,
      is_anonymous: nil,
      is_private: nil,
      title: nil
    }

    def room_fixture(attrs \\ %{}) do
      {:ok, room} =
        attrs
        |> Enum.into(@valid_attrs)
        |> BubbleRooms.create_room()

      room
    end

    test "list_rooms/0 returns all rooms" do
      room = room_fixture()
      assert BubbleRooms.list_rooms() == [room]
    end

    test "get_room!/1 returns the room with given id" do
      room = room_fixture()
      assert BubbleRooms.get_room!(room.id) == room
    end

    test "create_room/1 with valid data creates a room" do
      assert {:ok, %Room{} = room} = BubbleRooms.create_room(@valid_attrs)
      assert room.config_value == "some config_value"
      assert room.host_name == "some host_name"
      assert room.is_anonymous == true
      assert room.is_private == true
      assert room.title == "some title"
    end

    test "create_room/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = BubbleRooms.create_room(@invalid_attrs)
    end

    test "update_room/2 with valid data updates the room" do
      room = room_fixture()
      assert {:ok, %Room{} = room} = BubbleRooms.update_room(room, @update_attrs)
      assert room.config_value == "some updated config_value"
      assert room.host_name == "some updated host_name"
      assert room.is_anonymous == false
      assert room.is_private == false
      assert room.title == "some updated title"
    end

    test "update_room/2 with invalid data returns error changeset" do
      room = room_fixture()
      assert {:error, %Ecto.Changeset{}} = BubbleRooms.update_room(room, @invalid_attrs)
      assert room == BubbleRooms.get_room!(room.id)
    end

    test "delete_room/1 deletes the room" do
      room = room_fixture()
      assert {:ok, %Room{}} = BubbleRooms.delete_room(room)
      assert_raise Ecto.NoResultsError, fn -> BubbleRooms.get_room!(room.id) end
    end

    test "change_room/1 returns a room changeset" do
      room = room_fixture()
      assert %Ecto.Changeset{} = BubbleRooms.change_room(room)
    end
  end
end
