defmodule BubblitWeb.FallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """
  use BubblitWeb, :controller


# [TODO] 404 페이지 뜰 시 메인으로 리다이렉트 하기
# 로그인 되어있는 상태라면 메인에서 바로 로비로 갈 것이고 아니면 로그인 페이지에서 계속 있을 것임.
  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> put_view(BubblitWeb.ErrorView)
    |> render(:"404")
  end
end
