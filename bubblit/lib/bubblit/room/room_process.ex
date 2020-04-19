defmodule Bubblit.Room.Process do
  use Supervisor

  require Util

  def start_link(init_arg) do
    Util.log("#{inspect(init_arg)} 가지고 #{__MODULE__} 을 시작")
    [room_id: room_id] = init_arg
    Supervisor.start_link(__MODULE__, init_arg, name: via_tuple(room_id))
  end

  defp via_tuple(room_id) do
    {:via, Bubblit.Room.Registry, {:room_process, room_id}}
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
