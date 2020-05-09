defmodule Bubblit.Repo.Migrations.AddUsersColumnRoomTable do
  use Ecto.Migration

  def change do
    alter table("rooms") do
      add :users, :string
    end
  end
end
