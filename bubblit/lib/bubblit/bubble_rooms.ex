defmodule Bubblit.BubbleRooms do
  @moduledoc """
  The BubbleRooms context.
  """

  import Ecto.Query, warn: false
  alias Bubblit.Repo

  alias Bubblit.BubbleRooms.BubbleLog

  @doc """
  Returns the list of bubble_logs.

  ## Examples

      iex> list_bubble_logs()
      [%BubbleLog{}, ...]

  """
  def list_bubble_logs do
    Repo.all(BubbleLog)
  end

  def list_bubble_logs(room_id) do
    query =
      from l in BubbleLog,
        where: l.room_id == ^room_id

    Repo.all(query)
  end

  @doc """
  Gets a single bubble_log.

  Raises `Ecto.NoResultsError` if the Bubble log does not exist.

  ## Examples

      iex> get_bubble_log!(123)
      %BubbleLog{}

      iex> get_bubble_log!(456)
      ** (Ecto.NoResultsError)

  """
  def get_bubble_log!(id), do: Repo.get!(BubbleLog, id)

  @doc """
  Creates a bubble_log.

  ## Examples

      iex> create_bubble_log(%{field: value})
      {:ok, %BubbleLog{}}

      iex> create_bubble_log(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_bubble_log(attrs \\ %{}) do
    %BubbleLog{}
    |> BubbleLog.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a bubble_log.

  ## Examples

      iex> update_bubble_log(bubble_log, %{field: new_value})
      {:ok, %BubbleLog{}}

      iex> update_bubble_log(bubble_log, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_bubble_log(%BubbleLog{} = bubble_log, attrs) do
    bubble_log
    |> BubbleLog.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a bubble_log.

  ## Examples

      iex> delete_bubble_log(bubble_log)
      {:ok, %BubbleLog{}}

      iex> delete_bubble_log(bubble_log)
      {:error, %Ecto.Changeset{}}

  """
  def delete_bubble_log(%BubbleLog{} = bubble_log) do
    Repo.delete(bubble_log)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking bubble_log changes.

  ## Examples

      iex> change_bubble_log(bubble_log)
      %Ecto.Changeset{source: %BubbleLog{}}

  """
  def change_bubble_log(%BubbleLog{} = bubble_log) do
    BubbleLog.changeset(bubble_log, %{})
  end

  alias Bubblit.BubbleRooms.Room

  @doc """
  Returns the list of rooms.

  ## Examples

      iex> list_rooms()
      [%Room{}, ...]

  """
  def list_rooms do
    Repo.all(Room)
  end

  @doc """
  Gets a single room.

  Raises `Ecto.NoResultsError` if the Room does not exist.

  ## Examples

      iex> get_room!(123)
      %Room{}

      iex> get_room!(456)
      ** (Ecto.NoResultsError)

  """
  def get_room!(id), do: Repo.get!(Room, id)

  @doc """
  Creates a room.

  ## Examples

      iex> create_room(%{field: value})
      {:ok, %Room{}}

      iex> create_room(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_room(attrs \\ %{}) do
    %Room{}
    |> Room.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a room.

  ## Examples

      iex> update_room(room, %{field: new_value})
      {:ok, %Room{}}

      iex> update_room(room, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_room(%Room{} = room, attrs) do
    room
    |> Room.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a room.

  ## Examples

      iex> delete_room(room)
      {:ok, %Room{}}

      iex> delete_room(room)
      {:error, %Ecto.Changeset{}}

  """
  def delete_room(%Room{} = room) do
    Repo.delete(room)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking room changes.

  ## Examples

      iex> change_room(room)
      %Ecto.Changeset{source: %Room{}}

  """
  def change_room(%Room{} = room, attrs) do
    Room.changeset(room, attrs)
  end
end
