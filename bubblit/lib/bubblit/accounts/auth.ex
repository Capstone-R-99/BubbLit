defmodule Bubblit.Accounts.Auth do
  alias Bubblit.Accounts.{Encryption, User}
  import Util

  def login(params, repo) do
    user = repo.get_by(User, name: params["name"])

    case authenticate(user, params["password"]) do
      true -> {:ok, user}
      error ->
        Util.log(inspect(error))

        :error
    end
  end

  defp authenticate(user, password) do
    if user do
        case Encryption.validate_password(user, password) do
          # 갑자기 email이?
          {:ok, validated_user} -> true
          {:error, _} -> nil
        end
    else
      nil
    end
  end

  def signed_in?(conn) do
    conn.assigns[:current_user]
  end
end
