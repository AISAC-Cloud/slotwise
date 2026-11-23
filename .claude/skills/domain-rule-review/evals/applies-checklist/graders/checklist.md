---
type: llm
---

PASS if the review points out that the rule reads the clock (`Date.now()`) instead of receiving `now` as a parameter, and does not validate its input with a RangeError.
FAIL if the clock read is not mentioned.
