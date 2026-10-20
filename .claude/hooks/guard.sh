#!/usr/bin/env bash
# PreToolUse guard for this project.
#
#   .env files     -> denied   (read or write, any path)
#   git commits    -> denied   (commit, commit-tree, merge, cherry-pick, revert, am)
#   file writes    -> ask      (Write / Edit / NotebookEdit need explicit approval)
#   package adds   -> ask      (npm/pnpm/yarn/bun/pip/uv/cargo/go/gem/brew installs)
#   dev server     -> denied   (only when one is already running for this project)
#
# Reads the hook payload on stdin, emits a PreToolUse decision on stdout.

payload=$(cat)

tool=$(printf '%s' "$payload" | jq -r '.tool_name // ""')
input=$(printf '%s' "$payload" | jq -c '.tool_input // {}')

deny() {
  jq -nc --arg r "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $r
    }
  }'
  exit 0
}

ask() {
  jq -nc --arg r "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "ask",
      permissionDecisionReason: $r
    }
  }'
  exit 0
}

# ---------------------------------------------------------------- .env files
# Any path whose final component is .env or .env.<something>
is_env_path() {
  printf '%s' "$1" | grep -Eq '(^|/)(\.env|\.env\.[A-Za-z0-9_.-]+)$'
}

# A command that touches a .env file. `process.env` and similar are excluded
# so ordinary node/deno invocations are not flagged.
mentions_env_file() {
  printf '%s' "$1" \
    | sed -E 's/process\.env/PROCESS_ENV/g; s/import\.meta\.env/IMPORT_META_ENV/g' \
    | grep -Eq '(^|[^A-Za-z0-9_.-])\.env([.-][A-Za-z0-9_.-]+)?([^A-Za-z0-9_.-]|$)'
}

# ------------------------------------------------------------------- git
# Commit-creating git subcommands, with optional leading git flags.
GIT_COMMIT_RE='(^|[;&|(][[:space:]]*)git[[:space:]]+(-[^[:space:]]+[[:space:]]+([^[:space:]]+[[:space:]]+)?)*(commit|commit-tree|merge|cherry-pick|revert|am|rebase)([[:space:]]|$)'

# -------------------------------------------------------------- dev server
# Commands that start a Vite dev server for this project. `vite build` and
# `vite preview` are excluded -- they do not run a dev server.
DEV_START_RE='(^|[;&|(][[:space:]]*)(npm[[:space:]]+run[[:space:]]+dev|npx[[:space:]]+vite|vite)([[:space:]]|$)'

# Does this command start a dev server?
is_dev_start() {
  # Drop build/preview invocations first: `vite build` and `vite preview` do
  # not start a dev server, and `npx vite build` must not read as `npx vite`.
  stripped=$(printf '%s' "$1" | sed -E 's/vite[[:space:]]+(build|preview)/VITE_NOT_DEV/g')
  printf '%s' "$stripped" | grep -Eq "$DEV_START_RE"
}

# A Vite dev server is already serving this project?
dev_server_running() {
  # Project dir derived from this script's location: <project>/.claude/hooks/guard.sh
  project_dir=$(cd "$(dirname "$0")/../.." 2>/dev/null && pwd)

  # Prefer an exact process match: a vite process whose command line names
  # this project's node_modules.
  if command -v pgrep >/dev/null 2>&1; then
    pgrep -f "node .*${project_dir}/node_modules/\.bin/vite" >/dev/null 2>&1 && return 0
    pgrep -f "node .*${project_dir}/node_modules/vite/bin/vite\.js" >/dev/null 2>&1 && return 0
  fi

  # Fall back to probing the default Vite port and confirming it is a Vite
  # dev server (it serves the HMR client) rather than some other service.
  if command -v curl >/dev/null 2>&1; then
    curl -s --max-time 2 "http://127.0.0.1:5173/" 2>/dev/null | grep -q "/@vite/client" && return 0
  fi
  return 1
}


case "$tool" in
  Read | Write | Edit | NotebookEdit)
    path=$(printf '%s' "$input" | jq -r '.file_path // .notebook_path // ""')
    if is_env_path "$path"; then
      deny "Access to .env files is not permitted: $path. Ask the user if they need this file read or written."
    fi
    case "$tool" in
      Write | Edit | NotebookEdit)
        ask "Writing changes requires the user's approval. Confirm the file and the change before applying it."
        ;;
    esac
    ;;
  Grep)
    path=$(printf '%s' "$input" | jq -r '.path // ""')
    if is_env_path "$path"; then
      deny "Access to .env files is not permitted: $path."
    fi
    ;;
  Bash)
    cmd=$(printf '%s' "$input" | jq -r '.command // ""')
    if printf '%s' "$cmd" | grep -Eq "$GIT_COMMIT_RE"; then
      deny "Committing is not permitted. Prepare the changes and let the user commit."
    fi
    if mentions_env_file "$cmd"; then
      deny "Access to .env files is not permitted. Ask the user if they need this file read or written."
    fi
    if printf '%s' "$cmd" | grep -Eq '(^|[;&|(][[:space:]]*)(npm|pnpm|yarn|bun|npx|bunx)[[:space:]]+(-[^[:space:]]+[[:space:]]+)*(i|install|add|dlx|create|ci)([[:space:]]|$)|(^|[;&|(][[:space:]]*)(pip|pip3|uv|poetry|cargo|go|gem|brew|apt|apt-get)[[:space:]]+(-[^[:space:]]+[[:space:]]+)*(install|add|get|update|upgrade)([[:space:]]|$)'; then
      ask "Installing packages requires the user's approval. Confirm the exact package and version before running this."
    fi
    # `npx <pkg>` downloads the package unless it is already installed locally.
    npx_pkg=$(printf '%s' "$cmd" | grep -Eo '(^|[;&|(][[:space:]]*)npx[[:space:]]+(-[^[:space:]]+[[:space:]]+)*[@A-Za-z0-9_./-]+' | head -1 | grep -Eo '[@A-Za-z0-9_./-]+$')
    if [ -n "$npx_pkg" ] && [ ! -e "node_modules/.bin/${npx_pkg##*/}" ]; then
      ask "Running '$npx_pkg' would download it (it is not installed locally). Confirm with the user first."
    fi
    # The dev server may only be started when one is not already running.
    if is_dev_start "$cmd"; then
      if dev_server_running; then
        deny "A Vite dev server is already running for this project. Do not start another one; use the running server (http://localhost:5173)."
      fi
    fi
    ;;
esac

exit 0
