#!/bin/bash

function up_or_down() {
  read -rp "? UP or DOWN (U/d): " ACTION

  if [[ "$ACTION" == "d" || "$ACTION" == "D" ]]; then
    echo "d"
    return 0
  else
    echo "u"
    return 0
  fi

}

function is_test_env() {
  read -rp "? Setup for test environment (Y/n): " IS_TEST

  if [[ "$IS_TEST" == "n" || "$IS_TEST" == "N" ]]; then
    echo "n"
    return 0
  else
    echo "y"
    return 0
  fi

}

function wait_for_docker() {
  local MAX_WAIT=30
  local WAITED=0
  echo -n "⏳ Waiting for Docker to be ready (timeout: ${MAX_WAIT}s)..."
  until docker info >/dev/null 2>&1; do
    sleep 1
    WAITED=$((WAITED + 1))
    if [ "$WAITED" -ge "$MAX_WAIT" ]; then
      echo -n "❌ Error: Docker did not start within ${MAX_WAIT} seconds."
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

function up() {
  systemctl --user start docker-desktop
  wait_for_docker

  echo -ne "⛔ Cleaning up services..."
  pnpm run compose:down
  echo -ne "\n✅ Cleanup complete."

  echo -ne "\n▶ Starting services..."
  pnpm run compose:up
  echo -ne "\n✅ Services started."

  echo -ne "\n▶ Running migrations..."
  pnpm run db:generate
  pnpm run db:migrate
  echo -ne "\n✅ Migrations complete."

  echo -ne "\n✅ Setup complete.\n"
}

function down() {
  echo -ne "⛔ Shutting down services..."

  if [[ "$(is_compose_running)" == "y" ]]; then
    echo -ne "\n▶ Stopping services..."
    pnpm run compose:down
    echo -ne "\n✅ Services stopped."
  fi

  if [[ "$(is_docker_running)" == "y" ]]; then
    echo -ne "\n▶ Stopping Docker..."
    systemctl --user stop docker-desktop
    echo -ne "\n✅ Docker stopped."
  fi

  echo
}

main() {
  local action=$(up_or_down)

  case "$action" in
  u)
    if [[ "$(is_test_env)" == "y" ]]; then
      export DB_URL="postgresql://testuser:testpassword@localhost:5432/minicrm?schema=public"
    fi
    up
    ;;
  d)
    down
    ;;
  esac
}

main
