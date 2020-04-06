defmodule Bubblit.Repo.Migrations.ChangeRoomHostNameColumnToHostUserId do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      remove :host_name
      add :host_user_id, :integer
    end
  end
end
