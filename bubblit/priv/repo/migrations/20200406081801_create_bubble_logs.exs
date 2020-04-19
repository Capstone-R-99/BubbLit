defmodule Bubblit.Repo.Migrations.CreateBubbleLogs do
  use Ecto.Migration

  def change do
    create table(:bubble_logs) do
      add :room_id, :integer
      add :user_id, :integer
      add :content, :string

      timestamps()
    end
  end
end
