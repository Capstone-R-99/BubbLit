defmodule Bubblit.Room.Process do
  use Supervisor

  require Util

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg)
  end

  def init(init_arg) do
    Util.log("#{__MODULE__}이 init됩니다. #{inspect(init_arg)}")

    children = [
      worker(Bubblit.Room.Monitor, init_arg, restart: :permanent)
    ]

    opts = [strategy: :one_for_one]

    Supervisor.init(children, opts)
  end
end
