defmodule BubblitWeb.Router do
  use BubblitWeb, :router

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
    pipe_through [:browser, BubblitWeb.Plugs.Auth]

    delete "/logout", SessionController, :delete

    #왠진 모르겠는데 이게 없으면 그냥 index가 안되더라...
    get "/main", PageController, :index

    get "/*path", PageController, :index
  end


  # Other scopes may use custom stacks.
  # scope "/api", BubblitWeb do
  #   pipe_through :api
  # end
end
