# Agent Rules — Notes App Project

---

## 1. Phase Execution

- Execute one phase at a time.
- Do not begin the next phase until the current phase is fully complete.
- If a minor issue is detected at the end of a phase (styling inconsistency,
  misaligned element, incorrect behavior), fix it immediately before moving on.
- Do not carry unresolved issues forward.

---

## 2. Clarification Behavior

- If an instruction is ambiguous or has more than one valid interpretation,
  stop immediately.
- Ask one clear, specific question before proceeding.
- Do not assume. Do not guess. Do not continue with unresolved ambiguity.

---

## 3. Output Format

- After completing each phase, deliver a clear written summary only.
- The summary must state: what was built, what decisions were made, and
  what comes next.
- Do not output file code unless explicitly requested.

---

## 4. Error Handling

- If the code produces unexpected behavior or a bug is found, stop.
- Explain the problem clearly: what it is, where it is, and why it happened.
- Wait for acknowledgment, then apply the fix.
- Do not silently patch issues.

---

## 5. Code Style

- No comments anywhere in the code.
- All variable and function names use camelCase.
- No external libraries, CDN links, or third-party dependencies.
- No `prompt()`, `confirm()`, or `alert()` calls anywhere.
- All JavaScript must be enclosed inside a single IIFE — no global variables.
- All DOM queries must use `const` and be declared once at the top of the IIFE.
- CSS must use the defined custom properties — no hardcoded color values.

---

## 6. Scope Discipline

- Do not apply any improvement outside the current phase scope.
- If an improvement opportunity is spotted, report it clearly:
  what it is, where it is, and why it would help.
- Wait for explicit approval before acting on it.
- Nothing is changed or added without permission.

---