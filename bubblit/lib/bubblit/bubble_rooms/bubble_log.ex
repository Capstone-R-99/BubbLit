defmodule Bubblit.BubbleRooms.BubbleLog do
  use Ecto.Schema
  import Ecto.Changeset

  schema "bubble_logs" do
    field :content, :string
    field :room_id, :integer

    belongs_to :user, Bubblit.Accounts.User

    timestamps()
  end

  @doc false
  def changeset(bubble_log, attrs) do
    bubble_log
    |> cast(attrs, [:room_id, :user_id, :content])
    |> validate_required([:room_id, :user_id, :content])
  end
end
