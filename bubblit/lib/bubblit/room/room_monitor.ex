defmodule Bubblit.Room.Monitor do
  require Util
  use Agent

  def start_link({:room_id, room_id} = initial_state) do
    Util.log(" #{__MODULE__} #{inspect(initial_state)} 가 실행됩니다.")

    # 역순 저장임.
    history = Bubblit.Db.read_bubble_log(room_id) |> Enum.reverse()

    initial_state = %{history: history, room_id: room_id}
    Agent.start_link(fn -> initial_state end, name: via_tuple(room_id))
  end

  defp via_tuple(room_id) do
    {:via, Bubblit.Room.Registry, {:room_monitor, room_id}}
  end

  def add_message(room_id, user_id, message) do
    Agent.update(via_tuple(room_id), fn state -> handle_add_message(state, user_id, message) end)
  end

  def get_messages(room_id) do
    Agent.get(via_tuple(room_id), fn state -> handle_get_messages(state) end)
  end

  def handle_get_messages(state) do
    Map.get(state, :history, [])
  end

  def handle_add_message(state, user_id, message) do
    Util.log("user_id #{user_id} add_message #{message}")
    {:ok, bubble} = Bubblit.Db.create_bubble_log(state.room_id, user_id, message)
    history = [bubble | Map.get(state, :history, [])]

    Map.put(state, :history, history)
  end

  # 여기 아래는 참고용

  def get_record_state(state, _id) do
    state
    # case state[id] do
    #   nil ->
    #     record = Bubblechat.Db.get_or_create(id)

    #     state
    #     |> Map.put(id, record)

    #   _data ->
    #     state
    # end
  end

  defp step_record_update(state, id, step_record) do
    state = get_record_state(state, id)

    # record = state[id]
    # # {:ok, new_record} = Bubblechat.Test.update_record(record, %{step_record: step_record})
    # {:ok, new_record} = Bubblechat.Test.update_record(record, %{step_record: step_record})
    # Util.log("record #{inspect(record)}가 갱신.#{inspect(new_record)}로 됨여.")

    {state, Map.put(state, id, step_record)}
  end

  def get_record_state_id(id) do
    Util.log("get_record_state_id #{id}")
    get_record_state(id) |> Map.get(id)
  end

  def get_record_state(id) do
    Util.log("get_record_state #{id}")
    Agent.get(__MODULE__, fn state -> get_record_state(state, id) end)
  end

  def step_record_update(id, step_record) do
    Util.log("step_record_update #{id} #{step_record}")
    Agent.get_and_update(__MODULE__, fn state -> step_record_update(state, id, step_record) end)
  end
end
