defmodule Bubblit.Repo.Migrations.DeleteSubtypeRoomAction do
  use Ecto.Migration

  def change do
    alter table(:room_actions) do
      remove :sub_type
    end
  end
end
