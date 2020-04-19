defmodule BubblitWeb.Router do
  use BubblitWeb, :router

  require Util

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/", BubblitWeb do
    pipe_through [:browser, BubblitWeb.Plugs.Guest]

    get "/login", SessionController, :new
    post "/login", SessionController, :create

    resources "/register", UserController, only: [:create, :new]
  end

  scope "/", BubblitWeb do
    pipe_through [:browser, BubblitWeb.Plugs.Auth, :put_user_token]

    delete "/logout", SessionController, :delete

    # 왠진 모르겠는데 이게 없으면 그냥 index가 안되더라...
    get "/main", PageController, :index

    get "/*path", PageController, :index
  end

  defp put_user_token(conn, _) do
    if current_user = conn.assigns[:current_user] do
      token = Phoenix.Token.sign(conn, "user salt", current_user.id)
      assign(conn, :user_token, token)
    else
      conn
    end
  end

  # Other scopes may use custom stacks.
  # scope "/api", BubblitWeb do
  #   pipe_through :api
  # end
end
