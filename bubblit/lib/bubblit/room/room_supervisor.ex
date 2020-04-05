defmodule Bubblit.Room.DynamicSupervisor do
  use DynamicSupervisor
  require Util

  def start_link(init_arg) do
    Util.log("#{__MODULE__}이 start_link 됩니다.#{inspect(init_arg)}")
    DynamicSupervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  def start_child(room_id) do
    spec = {Bubblit.Room.Process, room_id: room_id}

    case DynamicSupervisor.start_child(__MODULE__, spec) do
      {:ok, _pid} -> {}
      {:error, {:already_started, _pid}} -> {}
      error -> raise error
    end
  end

  def init(_) do
    Util.log("#{__MODULE__}이 init됩니다.")

    DynamicSupervisor.init(strategy: :one_for_one)
  end
end
