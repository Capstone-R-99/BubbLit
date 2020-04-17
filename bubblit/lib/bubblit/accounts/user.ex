defmodule Bubblit.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Bubblit.Accounts.{User, Encryption}

  schema "users" do
    field :encrypted_password, :string
    field :name, :string

    # VIRTUAL FIELDS
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :password])
    |> validate_required([:name])
    |> validate_length(:password, min: 6)
    |> validate_confirmation(:password)
    |> validate_format(:name, ~r/^[a-z0-9][a-z0-9]+[a-z0-9]$/i)
    |> validate_length(:name, min: 3)
    |> unique_constraint(:name)
    |> encrypt_password
  end

  defp encrypt_password(changeset) do
    password = get_change(changeset, :password)

    if password do
      encrypted_password = Encryption.hash_password(password)
      put_change(changeset, :encrypted_password, encrypted_password)
    else
      changeset
    end
  end
end
