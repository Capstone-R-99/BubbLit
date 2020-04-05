defmodule Util do
  require Logger

  def log(msg) do
    Logger.info(IO.chardata_to_string(msg))
  end

  def log_error(msg) do
    Logger.error(msg)
  end

  def log_warn(msg) do
    Logger.warn(msg)
  end
end
