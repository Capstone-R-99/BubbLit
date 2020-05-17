use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :bubblit, BubblitWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

if System.get_env("GITHUB_ACTIONS") do
  config :bubblit, Bubblit.Repo,
    username: "test",
    password: "gitactiontest",
    database: "bubblechat_dev",
    hostname: "localhost",
    pool: Ecto.Adapters.SQL.Sandbox
else
  import_config "test.secret.exs"
end
