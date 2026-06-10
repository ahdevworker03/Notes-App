# PROJECT: Notes App — Agent Execution Plan

**STACK:** HTML · CSS · Vanilla JavaScript (ES6+)
**OUTPUT:** Single-page application, three files — index.html, style.css, app.js

---

## ENHANCEMENTS OVER ORIGINAL PLAN

- Replace `prompt()` and `confirm()` with a custom modal dialog (professional UX)
- Use `Date.now()` for unique IDs instead of sequential integers
- Implement event delegation on the notes container (not per-card listeners)
- Use CSS custom properties for theming
- Add empty state UI when no notes exist
- Add character limit: 300 characters per note
- Wrap all JS in an IIFE to avoid polluting the global scope
- Add timestamp to each note (createdAt), displayed on the card

---

## FILE STRUCTURE

```text
notes-app/
├── index.html
├── style.css
└── app.js
```

---

## DATA STRUCTURE

Each note is an object with this shape:

```json
{
  "id": "Number",        // Date.now() at creation
  "text": "String",      // max 300 characters
  "createdAt": "String"  // ISO date string
}
```

Notes are stored in `localStorage` under the key: `"notes_app_data"`
The value is a JSON-serialized array of note objects.

---

## PHASE 1 — HTML STRUCTURE (index.html)

**TASK:** Build the complete semantic HTML skeleton.

Required elements:
- `<header>` containing an `<h1>` with the app title "My Notes"
- `<main>` containing:
    - A `<button id="add-note-btn">` labeled "＋ Add Note"
    - A `<div id="notes-container">` (empty on load; JS fills it)
    - A `<p id="empty-state">` with text "No notes yet. Add one!" (hidden by default via class)
- A `<div id="modal-overlay">` containing:
    - A `<div id="modal">` with:
        - `<h2 id="modal-title">` (dynamic: "Add Note" or "Edit Note")
        - `<textarea id="modal-input" maxlength="300" placeholder="Write your note...">`
        - `<span id="char-count">0 / 300</span>`
        - `<div class="modal-actions">` with:
            - `<button id="modal-cancel-btn">Cancel</button>`
            - `<button id="modal-confirm-btn">Save</button>`
- Link `style.css` in `<head>`
- Load `app.js` with `defer` at the bottom of `<head>`

---

## PHASE 2 — CSS DESIGN (style.css)

**TASK:** Style all elements using CSS custom properties.

Define these variables in `:root`:
- `--bg: #f4f4f8`
- `--surface: #ffffff`
- `--primary: #6c63ff`
- `--primary-dark: #574fd6`
- `--danger: #e74c3c`
- `--text: #2d2d2d`
- `--muted: #888`
- `--radius: 12px`
- `--shadow: 0 4px 12px rgba(0,0,0,0.08)`

Styling rules:
- **body:** background `var(--bg)`, font-family Inter or system-ui, padding 2rem
- **header:** centered, margin-bottom 2rem
- **#add-note-btn:** background `var(--primary)`, white text, rounded pill shape, padding 0.6rem 1.4rem, hover darkens to `var(--primary-dark)`
- **#notes-container:** CSS Grid, auto-fill columns with min 240px, gap 1rem
- **Note card (.note-card):**
    - background `var(--surface)`, border-radius `var(--radius)`, box-shadow `var(--shadow)`
    - padding 1.2rem, display flex, flex-direction column, gap 0.6rem
    - `p.note-text`: flex-grow 1, color `var(--text)`, word-break: break-word
    - `span.note-date`: font-size 0.75rem, color `var(--muted)`
    - `.card-actions div`: flex row, gap 0.5rem, justify-content flex-end
    - `.edit-btn`: small, `var(--primary)` background
    - `.delete-btn`: small, `var(--danger)` background
- **Modal overlay (#modal-overlay):**
    - position fixed, inset 0, background `rgba(0,0,0,0.4)`
    - display flex, align-items center, justify-content center
    - hidden by default with class `"hidden"` (display: none)
- **#modal:** background `var(--surface)`, border-radius `var(--radius)`, padding 2rem, width `min(90%, 420px)`, display flex, flex-direction column, gap 1rem
- **#modal-input:** width 100%, min-height 120px, resize vertical, border 1px solid #ddd, border-radius 8px, padding 0.8rem, font-size 1rem
- **#char-count:** align-self flex-end, font-size 0.75rem, color `var(--muted)`
- **.modal-actions:** display flex, justify-content flex-end, gap 0.5rem
- **#modal-cancel-btn:** outlined style (border, transparent bg)
- **#modal-confirm-btn:** filled `var(--primary)` style
- **#empty-state:** text-align center, color `var(--muted)`, margin-top 3rem
- **.hidden utility class:** `display: none !important`

---

## PHASE 3 — JAVASCRIPT (app.js)

**TASK:** Implement all application logic inside a single IIFE.

```javascript
(function () {
  // All code lives here
})();
```

### 3A — CONSTANTS & STATE
- `const STORAGE_KEY = 'notes_app_data';`
- `const CHAR_LIMIT = 300;`
- `let notes = [];` // runtime state
- `let editingId = null;` // null = adding, number = editing

### 3B — DOM REFERENCES
Capture all required elements by ID at the top of the IIFE.

### 3C — STORAGE FUNCTIONS

**getNotesFromStorage()**
- Reads `localStorage.getItem(STORAGE_KEY)`
- Parses JSON, returns array (returns `[]` if null or parse error)

**saveNotesToStorage()**
- Serializes the notes array to JSON
- Writes to `localStorage.setItem(STORAGE_KEY, ...)`

### 3D — RENDER FUNCTION

**renderNotes()**
- Clears `#notes-container` innerHTML
- If `notes.length === 0`: show `#empty-state`, return
- Otherwise: hide `#empty-state`
- For each note in notes (reversed, newest first):
    - Create a `<div class="note-card">` with `data-id` attribute
    - Inner structure:
      ```html
      <p class="note-text">{note.text}</p>
      <span class="note-date">{formatted createdAt}</span>
      <div class="card-actions">
        <button class="edit-btn" data-id="{note.id}">Edit</button>
        <button class="delete-btn" data-id="{note.id}">Delete</button>
      </div>
      ```
    - Append to `#notes-container`
- Format date as: `"Jun 10, 2025 · 14:32"` using `toLocaleString()`

### 3E — MODAL FUNCTIONS

**openModal(mode, currentText = '')**
- `mode` is either `'add'` or `'edit'`
- Set `#modal-title` text accordingly
- Set `#modal-input` value to `currentText`
- Update `#char-count` to match `currentText.length`
- Remove `'hidden'` class from `#modal-overlay`
- Focus `#modal-input`

**closeModal()**
- Add `'hidden'` class to `#modal-overlay`
- Clear `#modal-input` value
- Reset `editingId` to null

### 3F — CRUD FUNCTIONS

**addNote(text)**
- Trims text, validates not empty and within `CHAR_LIMIT`
- Creates note object: `{ id: Date.now(), text, createdAt: new Date().toISOString() }`
- Pushes to notes array
- Calls `saveNotesToStorage()`
- Calls `renderNotes()`

**editNote(id, newText)**
- Finds note in notes by id (convert id to Number for comparison)
- Updates `note.text` to trimmed `newText`
- Calls `saveNotesToStorage()`
- Calls `renderNotes()`

**deleteNote(id)**
- Filters notes array to remove note with matching id
- Calls `saveNotesToStorage()`
- Calls `renderNotes()`

### 3G — EVENT LISTENERS

1. **#add-note-btn click:**
   - Set `editingId = null`
   - Call `openModal('add')`

2. **#modal-input input:**
   - Update `#char-count` text: `"{input.value.length} / 300"`

3. **#modal-confirm-btn click:**
   - Read and trim `#modal-input` value
   - Validate: if empty, shake the textarea (add/remove a 'shake' CSS class)
   - If `editingId` is null: call `addNote(text)`
   - Else: call `editNote(editingId, text)`
   - Call `closeModal()`

4. **#modal-cancel-btn click:**
   - Call `closeModal()`

5. **#modal-overlay click (for backdrop dismiss):**
   - If `event.target === #modal-overlay`: call `closeModal()`

6. **#notes-container click (event delegation):**
   - If `event.target.classList.contains('delete-btn')`:
       - Get id from `dataset.id` (parse to Number)
       - Call `deleteNote(id)`
   - If `event.target.classList.contains('edit-btn')`:
       - Get id from `dataset.id` (parse to Number)
       - Find the note in the array
       - Set `editingId = id`
       - Call `openModal('edit', note.text)`

### 3H — INITIALIZATION

- Set `notes = getNotesFromStorage()`
- Call `renderNotes()`

---

## PHASE 4 — TESTING CHECKLIST

Verify each of the following before marking the project complete:

- [ ] Empty note submission is rejected (modal shakes, no note created)
- [ ] Notes over 300 characters cannot be typed (maxlength enforced + char counter)
- [ ] Notes persist after hard refresh (F5 and Ctrl+Shift+R)
- [ ] Edit correctly pre-fills the modal with existing text
- [ ] Edited note updates in place (does not create a duplicate)
- [ ] Delete removes the correct note by ID
- [ ] Empty state message appears when all notes are deleted
- [ ] Newest notes appear at the top
- [ ] Modal closes on backdrop click and Cancel button
- [ ] App works without errors in browser console
