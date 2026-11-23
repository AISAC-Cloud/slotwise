---
name: domain-rule-review
description: Reviews a change to a slotwise scheduling rule against the domain invariants (pure function, no clock, half-open intervals, typed errors). Use when the user asks to review, check or look over a change to a scheduling or booking rule, such as working hours, overlap or cancellation, or anything under src/scheduling.
paths: src/scheduling/**
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/check-domain-purity.sh *)
---

# Review a scheduling rule

Files changed against main:

!`git diff --name-only main || true`

1. Read the changed files under `src/scheduling/` and the matching tests.
2. Run `${CLAUDE_SKILL_DIR}/scripts/check-domain-purity.sh src` and report every `file:line` it prints. A clock inside a rule is always a finding.
3. When the change touches intervals, errors or tests, open [reference.md](reference.md) and apply its checklist. Skip it otherwise.
4. Report each finding as `file:line`, a severity (high, medium, low) and a one-line fix. Do not edit anything.
