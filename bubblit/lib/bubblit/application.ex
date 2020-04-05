defmodule Bubblit.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    # List all child processes to be supervised
    children = [
      # Start the Ecto repository
      Bubblit.Repo,
      # Start the endpoint when the application starts
      BubblitWeb.Endpoint,
      # Starts a worker by calling: Bubblit.Worker.start_link(arg)
      # {Bubblit.Worker, arg},
      # 여기부턴 내가 추가함
      BubblitWeb.Presence,
      {Bubblit.Room.DynamicSupervisor, strategy: :one_for_one}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one]

    Util.log("#{__MODULE__} 이 시작됩니다.")

    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    BubblitWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
