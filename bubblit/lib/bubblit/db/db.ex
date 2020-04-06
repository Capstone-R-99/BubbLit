defmodule Bubblit.Db do
  # db관련 래핑 함수. 쿼리 직접 조작하는 것은 Generate 된 곳에 만든다.
  # 여기에는 쿼리를 직접 작성하지 말자.

  def create_room(title, host_user_id) do
    # 일단 Default 세팅으로 가보자.
    attrs = %{title: title, host_user_id: host_user_id, config_value: ""}
    {:ok, room_record} = Bubblit.BubbleRooms.create_room(attrs)

    room_record
  end

  def change_room_config(room_record, config_value) do
    # 일단 Default 세팅으로 가보자.
    attrs = %{config_value: config_value}
    {:ok, new_room_record} = Bubblit.BubbleRooms.change_room(room_record, attrs)

    new_room_record
  end

  def read_bubble_log(room_id) do
    Bubblit.BubbleRooms.list_bubble_logs(room_id)
  end

  def create_bubble_log(room_id, user_id, content) do
    # 방이 히스토리를 지원하는 config인지 확인해야함
    # config도 장기적으로는 db에 집어넣어서, 가져올것임.
    attrs = %{room_id: room_id, user_id: user_id, content: content}
    {:ok, _bubble_log} = Bubblit.BubbleRooms.create_bubble_log(attrs)
  end

  def create_user(name) do
    attrs = %{name: name}
    {:ok, user} = Bubblit.Accounts.create_user(attrs)

    user
  end
end
