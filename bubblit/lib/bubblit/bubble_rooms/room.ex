defmodule Bubblit.BubbleRooms.Room do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder,
           only: [:title, :host_user_id, :config_value, :is_private, :is_anonymous]}
  schema "rooms" do
    field :title, :string
    field :host_user_id, :integer
    field :config_value, :string
    field :is_private, :boolean, default: false
    field :is_anonymous, :boolean, default: false

    timestamps()
  end

  # cast란? attrs에서 취하는거
  # validate_required란? 있는지 없는지 체크하는거.

  # id는 auto increment니까 없어야 함
  @cast [:title, :host_user_id, :config_value, :is_private, :is_anonymous]
  @validate_required [:title, :host_user_id]
  def changeset(room, attrs) do
    room
    |> cast(attrs, @cast)
    |> validate_required(@validate_required)
  end
end
