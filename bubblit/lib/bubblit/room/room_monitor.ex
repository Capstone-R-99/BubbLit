defmodule Bubblit.Room.Monitor do
  require Util
  use Agent

  def start_link({:room_id, room_id} = initial_state) do
    Util.log(" #{__MODULE__} #{inspect(initial_state)} 가 실행됩니다.")

    room_record = Bubblit.Db.get_room(room_id)

    # 역순 저장임.
    {history, users} = Bubblit.Db.read_bubble_log(room_id) |> Enum.reverse() |> Enum.unzip()

    users_in_history = users |> Enum.map(fn user -> {user.id, user} end) |> Enum.into(%{})

    room_member_user =
      room_record.users
      |> Enum.map(fn x -> Bubblit.Accounts.get_user!(x) end)
      |> Enum.map(fn user -> {user.id, user} end)
      |> Enum.into(%{})

    Util.log("room_member_user Mere #{inspect(Map.merge(users_in_history, room_member_user))}")

    initial_state = %{
      history: history,
      users: Map.merge(users_in_history, room_member_user),
      tab_action_dic: %{},
      room_record: room_record
    }

    Agent.start_link(fn -> initial_state end, name: via_tuple(room_record.id))
  end

  defp via_tuple(room_id) do
    {:via, Bubblit.Room.Registry, {:room_monitor, room_id}}
  end

  def add_message(room_id, user_id, message) do
    Agent.update(via_tuple(room_id), fn state -> handle_add_message(state, user_id, message) end)
  end

  def add_tab_action(room_id, user_id, type, message) do
    Agent.update(via_tuple(room_id), fn state ->
      handle_add_tab_action(state, user_id, type, message)
    end)
  end

  def get_me(room_id) do
    Agent.get(via_tuple(room_id), fn state -> state end)
  end

  def get_after_join(room_id, user_id, user) do
    Agent.get_and_update(via_tuple(room_id), fn state ->
      handle_getate_after_join(state, user_id, user)
    end)
  end

  def handle_add_message(state, user_id, message) do
    Util.log("room#{state.room_record.id} user_id #{user_id} add_message #{message}")
    {:ok, bubble} = Bubblit.Db.create_bubble_log(state.room_record.id, user_id, message)
    history = [bubble | Map.get(state, :history, [])]

    Map.put(state, :history, history)
  end

  def handle_add_tab_action(state, user_id, tab_action_type, tab_action_body) do
    Util.log(
      "room#{state.room_record.id} user_id #{user_id} add_tab_action type #{tab_action_type} body #{
        tab_action_body
      }"
    )

    tab_action_dic =
      Map.put(state.tab_action_dic, tab_action_type, %{user_id: user_id, body: tab_action_body})

    Map.put(state, :tab_action_dic, tab_action_dic)
  end

  def handle_getate_after_join(state, user_id, user) do
    # {반환값, 뉴스테이트}
    Util.log("handle_getate_after_join #{inspect(state.room_record)}")
    user_list = state[:room_record].users
    Util.log("user_list #{inspect(user_list)}")

    cond do
      user_id in state.room_record.users ->
        {{:ok, make_ret(state)}, state}

      length(user_list) >= 6 ->
        {{:error, "User number is Max"}, state}

      true ->
        new_users = [user_id | user_list]
        Util.log("user_list #{inspect(user_list)} -> #{inspect(new_users)}")

        new_room = Bubblit.Db.update_room(state.room_record, %{users: new_users})

        state = put_in(state.room_record, new_room) |> refresh_user(user_id, user)

        {{:ok, make_ret(state)}, state}
    end
  end

  defp make_ret(state) do
    %{
      bubble_history: Map.get(state, :history, []),
      room_users: state[:room_record].users,
      users: Map.get(state, :users, []),
      tab_action_history: Map.get(state, :tab_action_dic, %{})
    }
  end

  def refresh_user(state, user_id, user) do
    refresh_users(state, user_id, user)
  end

  defp refresh_users(state, user_id, user) do
    if Map.has_key?(state[:users], user_id) do
      state
    else
      Util.log("add new user information to monitor #{user_id}")
      users = Map.put(state[:users], user_id, user)
      Map.put(state, :users, users)
    end
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
