---
name: commit-change
description: Run the tests and the typecheck, then commit the current changes with a Conventional Commits message. Use only when the user asks to commit.
disable-model-invocation: true
---

# Commit the current change

1. Run `npm run test`. If anything fails, stop and show the failure; do not commit.
2. Run `npm run typecheck`. If it fails, stop and show the errors; do not commit.
3. Look at `git status` and `git diff`, then stage only the files that belong to this change.
4. Commit with a Conventional Commits message: `type(scope): description`, in English, imperative, at most 72 characters in the header.
5. Do not push. Show the commit with `git log --oneline -1`.
