defmodule BubblitWeb.UserSocket do
  use Phoenix.Socket
  require Util

  ## Channels
  channel("room:*", BubblitWeb.RoomChannel)

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  def connect(%{"token" => token}, socket, _connect_info) do
    case Phoenix.Token.verify(socket, "user salt", token, max_age: 86400) do
      {:ok, user_id} ->
        user = Bubblit.Accounts.get_user!(user_id)
        Util.log("#{inspect(user)} login.")
        socket = assign(socket, :user, user) |> assign(:user_id, user_id)
        {:ok, socket}

      {:error, error} ->
        Util.log("#{inspect(error)} error.")
        :error
    end
  end

  def connect(params, _socket, _connect_info) do
    Util.log_error("has no tokens! #{inspect(params)}")

    :error
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     BubblitWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  def id(_socket), do: nil
end
