#!/usr/bin/env bash
# check-env.sh: checks the environment of the Claude Code Architect 2.0 labs.
#
# Run it from the folder where your projects live:  ./check-env.sh
# It only reads; it changes nothing. Exit code 0 means every check passed.
# It does not check logins: GitHub and Claude Code logins are yours to do.
set -u

readonly MIN_NODE_MAJOR=22
failed=0

ok()   { printf '  OK    %-15s %s\n' "$1" "$2"; }
fail() { printf '  FAIL  %-15s %s\n' "$1" "$2"; failed=$((failed + 1)); }
has()  { command -v "$1" >/dev/null 2>&1; }

# Short versions for tools whose first line of --version is long.
curl_version()  { curl --version | head -n 1 | cut -d ' ' -f 1-2; }
socat_version() { socat -V 2>/dev/null | grep -m 1 'socat version' | cut -d ' ' -f 1-3; }

# check_tool <command> <fix> <version command...>
check_tool() {
  local name=$1 fix=$2 version
  shift 2
  if ! has "$name"; then
    fail "$name" "not found: $fix"
    return
  fi
  version=$("$@" 2>/dev/null | head -n 1)
  if [ -n "$version" ]; then
    ok "$name" "$version"
  else
    fail "$name" "found, but it does not run: $fix"
  fi
}

check_system() {
  echo "System"
  local kernel
  kernel=$(uname -r)
  case "$kernel" in
    *WSL2*) ok "wsl" "WSL 2" ;;
    *[Mm]icrosoft*) fail "wsl" "WSL 1: the sandbox needs WSL 2 (wsl --set-version <distro> 2)" ;;
    *) ok "os" "$(uname -s) $kernel" ;;
  esac
  case "$PWD" in
    /mnt/*) fail "folder" "$PWD is on the Windows disk: use ~/projects" ;;
    *) ok "folder" "$PWD" ;;
  esac
}

check_node() {
  if ! has node; then
    fail "node" "not found: nvm install --lts"
    return
  fi
  local version major
  version=$(node -v)
  major=${version#v}
  major=${major%%.*}
  if [ "$major" -ge "$MIN_NODE_MAJOR" ]; then
    ok "node" "$version"
  else
    fail "node" "$version is older than $MIN_NODE_MAJOR: nvm install --lts"
  fi
}

check_docker() {
  check_tool docker "install Docker Desktop and enable WSL integration" docker --version
  docker --version >/dev/null 2>&1 || return
  if docker info >/dev/null 2>&1; then
    ok "docker daemon" "running"
  else
    fail "docker daemon" "not reachable: start Docker Desktop"
  fi
  if docker compose version >/dev/null 2>&1; then
    ok "docker compose" "$(docker compose version --short)"
  else
    fail "docker compose" "not found: update Docker Desktop"
  fi
}

check_tools() {
  echo "Tools"
  check_tool git "sudo apt install -y git" git --version
  check_tool curl "sudo apt install -y curl" curl_version
  check_node
  check_tool npm "comes with node: nvm install --lts" npm -v
  check_tool gh "install the GitHub CLI (lesson 0.3)" gh --version
  check_docker
  check_tool claude "curl -fsSL https://claude.ai/install.sh | bash" claude --version
}

# The Claude Code sandbox uses bubblewrap and socat on Linux and WSL 2.
check_sandbox() {
  [ "$(uname -s)" = "Linux" ] || return
  echo "Sandbox"
  if ! has bwrap; then
    fail "bubblewrap" "not found: sudo apt install -y bubblewrap"
  elif bwrap --ro-bind / / --dev /dev --proc /proc true 2>/dev/null; then
    ok "bubblewrap" "creates a sandbox"
  else
    fail "bubblewrap" "installed, but cannot create a sandbox"
  fi
  check_tool socat "sudo apt install -y socat" socat_version
}

check_git_identity() {
  echo "Git"
  local name email
  name=$(git config --global user.name 2>/dev/null || true)
  email=$(git config --global user.email 2>/dev/null || true)
  if [ -n "$name" ] && [ -n "$email" ]; then
    ok "identity" "$name <$email>"
  else
    fail "identity" "git config --global user.name / user.email"
  fi
}

main() {
  check_system
  check_tools
  check_sandbox
  check_git_identity
  echo
  if [ "$failed" -eq 0 ]; then
    echo "All checks passed. Your environment is ready."
    return 0
  fi
  echo "$failed check(s) failed. Fix them and run ./check-env.sh again."
  return 1
}

main
