defmodule BubblitWeb.UserController do
  use BubblitWeb, :controller

  alias Bubblit.Accounts
  alias Bubblit.Accounts.User

  def new(conn, _params) do
    changeset = Accounts.change_user(%User{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"user" => user_params}) do
    case Accounts.create_user(user_params) do
      {:ok, user} ->
        conn
        |> login_user(user)
        |> put_flash(:info, "Signed up successfully.")
        |> redirect(to: Routes.page_path(conn, :index))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def login_user(conn, user) do
    Util.log("login user. #{inspect(conn.assigns)}")

    conn
    |> put_session(:current_user_id, user.id)
    |> put_session(:current_user, user)
  end

  def logout_user(conn) do
    conn
    |> delete_session(:current_user_id)
    |> delete_session(:current_user)
  end
end
