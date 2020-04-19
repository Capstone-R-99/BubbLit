defmodule BubblitWeb.SessionController do
  use BubblitWeb, :controller

  alias Bubblit.Accounts.Auth
  alias Bubblit.Repo

  def new(conn, _params) do
    render(conn, "new.html")
  end

  @spec create(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def create(conn, %{"session" => auth_params}) do
    case Auth.login(auth_params, Repo) do
      {:ok, user} ->
        conn
        |> BubblitWeb.UserController.login_user(user)
        |> put_flash(:info, "Signed in successfully.")
        |> redirect(to: Routes.page_path(conn, :index))

      :error ->
        conn
        |> put_flash(:error, "There was a problem with your name/password")
        |> render("new.html")
    end
  end

  def delete(conn, _params) do
    conn
    |> BubblitWeb.UserController.logout_user()
    |> put_flash(:info, "Signed out successfully.")
    |> redirect(to: Routes.session_path(conn, :new))
  end
end
