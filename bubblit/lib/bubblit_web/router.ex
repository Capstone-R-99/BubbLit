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
    plug(:fetch_session)
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

    get "/", PageController, :index

    # 리액트 싱글 페이지 라우팅 작동 안되서 만든 임시코드
    get "/main", PageController, :f__k_react
    get "/room", PageController, :f__k_react
    # get "/*path", PageController, :index
  end

  scope "/api", BubblitWeb do
    pipe_through [:api]
    resources "/room/get", RoomController, only: [:index, :show]
  end

  scope "/api", BubblitWeb do
    pipe_through [:api, BubblitWeb.Plugs.Auth, :put_user_token]

    resources "/room/make", RoomController, except: [:index, :show]

    post "/room/upload_image/*room_id", RoomImageController, :new
    get "/room/get_image/*room_id", RoomImageController, :show
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
