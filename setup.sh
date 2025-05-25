#!/bin/bash

function load_env() {
  local file="${1:-.env.local}"
  echo "🔍 Loading env from $file"
  set -a
  source "$file"
  set +a
}

function get_env() {
  local env

  while [[ "$env" != "test" && "$env" != "dev" ]]; do
    read -rp "? What environment do you want to setup (TEST/dev): " env
    # lower case
    env="${env,,}"

    trimmed="$(echo -e "$env" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"

    if [[ -z "$trimmed" ]]; then
      echo "test"
      break
    fi

  done

  echo "$env"

  return 0
}

function wait_for_docker() {
  local MAX_WAIT=30
  local WAITED=0
  echo "⏳ Waiting for Docker to be ready (timeout: ${MAX_WAIT}s)..."
  until docker info >/dev/null 2>&1; do
    sleep 1
    WAITED=$((WAITED + 1))
    if [ "$WAITED" -ge "$MAX_WAIT" ]; then
      echo "❌ Error: Docker did not start within ${MAX_WAIT} seconds."
      exit 1
    fi
  done
  echo "✅ Docker is up and running."
}

function is_docker_running() {
  if docker info >/dev/null 2>&1; then
    echo "y"
    return 0
  else
    echo "n"
    return 0
  fi
}

function is_compose_running() {
  local COMPOSE_STATUS=""

  if output=$(docker compose ps -q 2>/dev/null); then
    echo "y"
    return 0
  else
    echo "n"
    return 0
  fi

}

function start_studio() {
  echo " 👉 Run Studio"
  pnpm run db:studio &>/dev/null &
  local STUDIO_PID=$!
  echo "🔍 Drizzle Studio PID: $STUDIO_PID"
  echo -ne "🚀 Access the studio via: \033[0;32mhttps://local.drizzle.studio\033[0m"
}

function up() {
  systemctl --user start docker-desktop
  wait_for_docker

  echo -ne "\n⛔ Cleaning up services..."
  docker compose down
  echo "✅ Cleanup complete."

  echo "▶ Running docker compose up for: $@"
  docker compose up "$@" -d
  echo "✅ Services started."

  echo "▶ Running migrations..."
  pnpm run db:generate
  pnpm run db:migrate
  echo -e "\n✅ Migrations complete."

  echo "✅ Setup complete."

  start_studio
}

function down() {
  echo -e "\n⛔ Shutting down services..."

  if [[ "$(is_compose_running)" == "y" ]]; then
    echo "▶ Stopping services..."
    docker compose down
    echo "✅ Services stopped."
  fi

  if [[ "$(is_docker_running)" == "y" ]]; then
    echo "▶ Stopping Docker..."
    systemctl --user stop docker-desktop
    echo "✅ Docker stopped."
  fi

  echo
  exit 0
}

main() {
  load_env .env.local

  arg="$1"

  local env

  arg="${arg,,}"

  if [[ "$arg" == "--dev" ]]; then
    env="dev"
  elif [[ "$arg" == "--test" ]]; then
    env="test"
  else
    env="$(get_env)"
  fi

  if [[ "$env" == "test" ]]; then
    export DB_URL="postgresql://testuser:testpassword@localhost:5432/minicrm?schema=public"
    up postgres-test
  elif [[ "$env" == "dev" ]]; then
    up postgres-dev
  fi

  trap down EXIT
  tail -f /dev/null
}

main
