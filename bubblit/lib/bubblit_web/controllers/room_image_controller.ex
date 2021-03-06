defmodule BubblitWeb.RoomImageController do
  use BubblitWeb, :controller
  require Util

  def new(conn, %{"room_id" => [room_id], "file" => file} = _param) do
    {room_id, ""} = Integer.parse(room_id)

    user_id = Plug.Conn.get_session(conn, :current_user_id)

    restricted? = Ets.room_control_restricted?(room_id)
    host? = Bubblit.Db.get_room(room_id).host_user_id == user_id

    if not restricted? || host? do
      image_file_path = Path.absname("uploaded")

      unless File.exists?(image_file_path) and File.dir?(image_file_path) do
        Util.log("Create Uploaded Folder")
        :ok = File.mkdir(image_file_path)
      end

      # file_name = Path.basename(file.path)
      # extention = MIME.extensions(file.content_type) |> List.first()

      file_name = "#{DateTime.to_unix(DateTime.utc_now(), :millisecond)}_#{room_id}_#{user_id}"
      saved_path = get_image_by_file_path(file_name)

      Util.log("#{user_id} uploaded image. save file from #{file.path} -> to #{saved_path}")

      case File.cp(file.path, saved_path) do
        :ok ->
          json(conn, %{file_name: file_name})

        {:error, msg} ->
          Util.log_error("#{user_id} uploaded image failed. to #{get_room_image_path(room_id)}")
          json(conn |> put_status(:not_found), "error! #{msg}")
      end
    else
      json(conn |> put_status(:not_found), "error! restricted tab action and you are not host")
    end
  end

  # 권한 체크 필요.
  def show(conn, %{"room_id" => room_id} = _param) do
    send_file(conn, 200, get_room_image_path(room_id))
  end

  # 권한 체크 필요.
  def show(conn, %{"file_name" => file_name} = _param) do
    send_file(conn, 200, get_image_by_file_path(file_name))
  end

  def get_room_image_path(room_id) do
    image_file_path = Path.absname("uploaded")

    "#{image_file_path}/room_#{room_id}_image"
  end

  def get_image_by_file_path(file_path) do
    image_file_path = Path.absname("uploaded")

    "#{image_file_path}/#{file_path}"
  end

end
