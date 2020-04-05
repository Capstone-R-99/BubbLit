defmodule Bubblit.Room.Registry do
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, nil, name: :room_registry)
  end

  # API for support :via

  def whereis_name(room_id) do
    GenServer.call(:room_registry, {:whereis_name, room_id})
  end

  def register_name(room_id, pid) do
    GenServer.call(:room_registry, {:register_name, room_id, pid})
  end

  def unregister_name(room_id) do
    GenServer.cast(:room_registry, {:unregister_name, room_id})
  end

  def send(room_id, message) do
    case whereis_name(room_id) do
      :undefined ->
        {:badarg, {room_id, message}}

      pid ->
        Kernel.send(pid, message)
        pid
    end
  end

  def init(_) do
    {:ok, Map.new()}
  end

  def handle_call({:whereis_name, room_id}, _from, state) do
    {:reply, Map.get(state, room_id, :undefined), state}
  end

  def handle_call({:register_name, room_id, pid}, _from, state) do
    case Map.get(state, room_id) do
      nil ->
        Process.monitor(pid)
        {:reply, :yes, Map.put(state, room_id, pid)}

      _ ->
        {:reply, :no, state}
    end
  end

  def handle_cast({:unregister_name, room_id}, state) do
    {:noreply, Map.delete(state, room_id)}
  end

  def handle_info({:DOWN, _, :process, pid, _}, state) do
    {:noreply, remove_pid(state, pid)}
  end

  def remove_pid(state, pid_to_remove) do
    remove = fn {_key, pid} -> pid != pid_to_remove end
    Enum.filter(state, remove) |> Enum.into(%{})
  end
end
