# Notetaker Chrome Extension: Project Log

## Purpose
This log documents the reasoning, design decisions, and best practices behind the development of the Notetaker Chrome extension. It serves as a reference for future contributors and as a learning resource for understanding the "why" behind each step.

---

### 2025-04-20: Project Initialization
- **Reasoning:** Separate the Chrome extension from the Flask web app for maintainability and clean architecture. This allows independent development, testing, and deployment.
- **Best Practice:** Use a dedicated folder/repo for the extension, following the structure recommended by Chrome extension guidelines.

### Sidebar UI & Interactivity
- **Why Sidebar First?** The sidebar is the core navigation for the app. Building it first establishes the foundation for all other features and helps visualize the app’s structure early.
- **Mock Data:** Used to quickly prototype UI and logic before integrating persistent storage. This allows for rapid iteration and feedback.
- **Dropdowns & Highlighting:** Section dropdowns and note highlighting improve usability and make navigation intuitive. Active states (highlighting) are a UI/UX best practice.
- **Separation of Concerns:** Sidebar and main panel rendering are kept modular for maintainability and clarity.
- **CSS Best Practices:** All styling is done with CSS classes, not inline styles, for easier updates and scalability.

---

### 2025-04-20: Added Edit and Delete Icons
- **Reasoning:** Added edit and delete icons to the main panel for each note, using SVGs for a modern, accessible UI. This follows best practices by making actions easily discoverable and keeping the interface clean.
- **Best Practice:** Click handlers currently log actions for future implementation. This step prepares the app for full CRUD functionality and is logged for future reference.

---

### 2025-04-20: Sidebar, Main Panel, and CRUD for Notes
- **Sidebar UI:** Implemented a sidebar with section dropdowns and note lists using mock data. Used modular rendering functions for maintainability and clarity.
- **Styling:** Applied modern, minimal CSS for sidebar, section headers, and notes. Used CSS classes for maintainability and best practices.
- **Note Selection:** Added interactivity to highlight the selected note in the sidebar and display its details in the main panel. Used a selectedNoteId variable for state management.
- **Main Panel Details:** Expanded the main panel to show all note fields (title, section, content, keywords, summary, createdAt) to match the Flask app structure.
- **Edit/Delete Icons:** Added SVG edit and delete icons to the main panel for each note. Used event listeners (not inline handlers) for best practice and maintainability.
- **Delete Note:** Implemented delete functionality for notes, including confirmation, UI update, and event re-attachment after DOM changes. Used a helper function to keep code DRY.
- **Edit Note:** Implemented edit functionality. Clicking the edit icon shows a pre-filled form in the main panel. On save, updates the note and re-renders the UI. Cancel returns to the note view.
- **Create Note:** Added a '+ New' button above the sidebar. Clicking it shows a form to create a new note. On submit, adds the note, updates the UI, and selects the new note. Cancel returns to the previous view.
- **Best Practices:** All UI/UX follows modern standards: clear feedback, modular code, DRY principles, and separation of concerns. All major decisions and reasoning are logged for future reference and learning.

---

This log will be updated as the project evolves, capturing the intent and rationale behind each major decision.
