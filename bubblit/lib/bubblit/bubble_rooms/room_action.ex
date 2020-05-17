defmodule Bubblit.BubbleRooms.RoomAction do
  use Ecto.Schema
  import Ecto.Changeset

  schema "room_actions" do
    belongs_to :room, Bubblit.BubbleRooms.Room
    field :type, :integer
    field :sub_type, :integer
    field :param, :string

    timestamps()
  end

  @doc false
  def changeset(room_action, attrs) do
    room_action
    |> cast(attrs, [:room_id, :type, :sub_type, :param])
    |> validate_required([:room_id, :type, :sub_type, :param])
  end
end
