defmodule Ets do
  require Logger

  def init(msg) do
    # 우선 전부 public
    table = :ets.new(:room_info, [:set, :public])
  end

  def add_room_info(room) do
    :ets.insert(:user_lookup, {room.id, room})
  end

  def add_room_info(room) do
    case :ets.lookup(:user_lookup, "doomspork") do
      [room] -> room
      [] -> nil
    end
  end
end
