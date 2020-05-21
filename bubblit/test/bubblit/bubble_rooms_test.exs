defmodule Bubblit.BubbleRoomsTest do
  # describe "room_actions" do
  #   alias Bubblit.BubbleRooms.RoomAction

  #   @valid_attrs %{param: "some param", type: 42}
  #   @update_attrs %{param: "some updated param", type: 43}
  #   @invalid_attrs %{param: nil, type: nil}

  #   def room_action_fixture(attrs \\ %{}) do
  #     {:ok, room_action} =
  #       attrs
  #       |> Enum.into(@valid_attrs)
  #       |> BubbleRooms.create_room_action()

  #     room_action
  #   end

  #     test "list_room_actions/0 returns all room_actions" do
  #       room_action = room_action_fixture()
  #       assert BubbleRooms.list_room_actions() == [room_action]
  #     end

  #     test "get_room_action!/1 returns the room_action with given id" do
  #       room_action = room_action_fixture()
  #       assert BubbleRooms.get_room_action!(room_action.id) == room_action
  #     end

  #     test "create_room_action/1 with valid data creates a room_action" do
  #       assert {:ok, %RoomAction{} = room_action} = BubbleRooms.create_room_action(@valid_attrs)
  #       assert room_action.param == "some param"
  #       assert room_action.type == 42
  #     end

  #     test "create_room_action/1 with invalid data returns error changeset" do
  #       assert {:error, %Ecto.Changeset{}} = BubbleRooms.create_room_action(@invalid_attrs)
  #     end

  #     test "update_room_action/2 with valid data updates the room_action" do
  #       room_action = room_action_fixture()

  #       assert {:ok, %RoomAction{} = room_action} =
  #                BubbleRooms.update_room_action(room_action, @update_attrs)

  #       assert room_action.param == "some updated param"
  #       assert room_action.type == 43
  #     end

  #     test "update_room_action/2 with invalid data returns error changeset" do
  #       room_action = room_action_fixture()

  #       assert {:error, %Ecto.Changeset{}} =
  #                BubbleRooms.update_room_action(room_action, @invalid_attrs)

  #       assert room_action == BubbleRooms.get_room_action!(room_action.id)
  #     end

  #     test "delete_room_action/1 deletes the room_action" do
  #       room_action = room_action_fixture()
  #       assert {:ok, %RoomAction{}} = BubbleRooms.delete_room_action(room_action)
  #       assert_raise Ecto.NoResultsError, fn -> BubbleRooms.get_room_action!(room_action.id) end
  #     end

  #     test "change_room_action/1 returns a room_action changeset" do
  #       room_action = room_action_fixture()
  #       assert %Ecto.Changeset{} = BubbleRooms.change_room_action(room_action)
  #   #     end
  # end
end
