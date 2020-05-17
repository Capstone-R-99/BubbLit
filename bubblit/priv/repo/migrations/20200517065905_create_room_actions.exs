defmodule Bubblit.Repo.Migrations.CreateRoomActions do
  use Ecto.Migration

  def change do
    create table(:room_actions) do
      add :type, :string
      add :sub_type, :string
      add :param, :string
      add :room_id, references(:rooms, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:room_actions, [:room_id])
    create index(:room_actions, [:user_id])
  end
end
