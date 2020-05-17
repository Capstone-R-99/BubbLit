defmodule Bubblit.BubbleRooms.RoomAction do
  use Ecto.Schema
  import Ecto.Changeset

  schema "room_actions" do
    belongs_to :room, Bubblit.BubbleRooms.Room
    belongs_to :user, Bubblit.Accounts.User
    field :type, :string
    field :sub_type, :string
    field :param, :string

    timestamps()
  end

  @doc false
  def changeset(room_action, attrs) do
    room_action
    |> cast(attrs, [:room_id, :user_id, :type, :sub_type, :param])
    |> validate_required([:room_id, :user_id, :type])
  end
end
