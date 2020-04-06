defmodule Bubblit.BubbleRooms.Room do
  use Ecto.Schema
  import Ecto.Changeset

  schema "rooms" do
    field :config_value, :string
    field :host_name, :string
    field :is_anonymous, :boolean, default: false
    field :is_private, :boolean, default: false
    field :title, :string

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    room
    |> cast(attrs, [:title, :host_name, :config_value, :is_private, :is_anonymous])
    |> validate_required([:title, :host_name, :config_value, :is_private, :is_anonymous])
  end
end
