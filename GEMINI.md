# Smart Note App

A lightweight, persistent note-taking application built with vanilla web technologies.

## Project Overview

The Smart Note App allows users to create, edit, and delete notes. It features a responsive grid layout, character limit enforcement, and local storage persistence to ensure notes remain available after a page refresh.

### Core Technologies
- **HTML5**: Semantic structure and modal system.
- **CSS3**: Responsive design using CSS Grid, custom properties for theming, and keyframe animations.
- **JavaScript (ES6+)**: Functional logic encapsulated in an IIFE, event delegation, and `localStorage` integration.

## Building and Running

This project is a static web application and does not require a build step or external dependencies.

- **Run**: Open `index.html` in any modern web browser.
- **Testing**: Manual verification against the checklist in `rules.md`.

## Development Conventions

All development must strictly adhere to the guidelines established in `rules.md`.

### JavaScript
- **Encapsulation**: All logic must reside within a single IIFE. No global variables are permitted.
- **DOM Access**: All DOM queries must use `const`, be declared once at the top of the IIFE, and referenced throughout.
- **Naming**: Use `camelCase` for all variables and function names.
- **Dependencies**: No external libraries, CDNs, or third-party dependencies.
- **Clean Code**: No comments are allowed within the source files.

### CSS
- **Theming**: Use CSS custom properties (variables) for all colors, radii, and shadows. Do not use hardcoded color values.
- **Layout**: Prefer CSS Grid for container layouts and Flexbox for component alignment.
- **Interactivity**: Use utility classes (like `.hidden`) and keyframe animations for UI state and feedback.

### Architecture
- **State Management**: Application state is managed via a central `notes` array and synchronized with `localStorage`.
- **Rendering**: The UI is updated through a `renderNotes()` function that clears and repopulates the container based on the current state.
- **Event Handling**: Use event delegation on the notes container for card-level actions (Edit/Delete).
