defmodule Bubblit.Repo.Migrations.SetForeignKeyTableBubbleLogsUserIdToUsers do
  use Ecto.Migration

  def change do
    alter table("bubble_logs") do
      remove :user_id
      add :user_id, references("users")
    end
  end
end
