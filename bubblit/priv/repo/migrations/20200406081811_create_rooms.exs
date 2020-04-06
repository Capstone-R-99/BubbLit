defmodule Bubblit.Repo.Migrations.CreateRooms do
  use Ecto.Migration

  def change do
    create table(:rooms) do
      add :title, :string
      add :host_name, :string
      add :config_value, :string
      add :is_private, :boolean, default: false, null: false
      add :is_anonymous, :boolean, default: false, null: false

      timestamps()
    end

  end
end
