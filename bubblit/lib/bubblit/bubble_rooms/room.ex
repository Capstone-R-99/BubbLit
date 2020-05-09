defmodule Bubblit.BubbleRooms.Room do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder,
           only: [:id, :title, :host_user_id, :config_value, :is_private, :is_anonymous, :users]}
  schema "rooms" do
    field :title, :string
    field :host_user_id, :integer
    field :config_value, :string
    field :is_private, :boolean, default: false
    field :is_anonymous, :boolean, default: false
    # List를 지원하지 않기에 슬프지만 string으로 저장한다. 컴마로 구별
    field :users, :string

    timestamps()
  end

  # cast란? attrs에서 취하는거
  # validate_required란? 있는지 없는지 체크하는거.

  # id는 auto increment니까 없어야 함
  @cast [:title, :host_user_id, :config_value, :is_private, :is_anonymous, :users]
  @validate_required [:title, :host_user_id]
  def changeset(room, attrs) do
    room
    |> cast(attrs, @cast)
    |> validate_required(@validate_required)
  end
end
