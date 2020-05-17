defmodule Bubblit.Repo.Migrations.CreateRoomActions do
  use Ecto.Migration

  def change do
    create table(:room_actions) do
      add :type, :integer
      add :sub_type, :integer
      add :param, :string
      add :room_id, references(:rooms, on_delete: :nothing)

      timestamps()
    end

    create index(:room_actions, [:room_id])
  end
end
