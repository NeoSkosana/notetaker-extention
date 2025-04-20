# Plan: Porting Notetaker Web App to a Chrome Extension

## Objective
Create a Chrome extension version of the Notetaker app with the same features as the web app, including section-based note organization, CRUD operations, and voice recognition for all note fields. The extension should allow users to record and manage notes directly from the browser popup.

## 1. Project Structure
- Create a new folder/repo for the Chrome extension (e.g., `notetaker-extension/`).
- Core files:
  - `manifest.json` (extension metadata and permissions)
  - `popup.html` (main UI)
  - `popup.js` (UI logic, speech recognition, storage)
  - `popup.css` (styling)
  - (Optional) `background.js` (for background tasks)

## 2. UI/UX Design
- Design a compact, responsive UI for the popup window, similar to the dashboard.html layout:
  - Sidebar for sections and notes (with dropdowns, edit/delete icons)
  - Main panel for note details and forms
  - Microphone icons for voice input on all fields
- Use minimalistic SVG icons for consistency with the web app.

## 3. Feature Parity
- All features from the web app must be present:
  - Create, view, edit, and delete notes
  - Organize notes by section (with dropdowns)
  - Edit/delete sections (with 'Uncategorized' handling)
  - Text-to-speech (speech-to-text) for all note fields
  - Truncation, tooltips, and UI polish

## 4. Data Storage
- Use `chrome.storage.local` or `IndexedDB` for storing notes and sections locally in the browser.
- Structure data as:
  - Sections: Array of section objects (id, name)
  - Notes: Array of note objects (id, title, notes, keywords, summary, sectionId, createdAt)
- Implement migration logic if the data model changes in future versions.

## 5. Voice Recognition
- Use the Web Speech API (window.SpeechRecognition) for speech-to-text in the extension popup.
- Provide visual feedback and error handling as in the web app.
- Ensure permissions and HTTPS requirements are met (extensions run in a secure context).

## 6. Sync with Web App (Optional)
- If you want cloud sync and multi-device support:
  - Expose a REST API in the Flask web app for notes/sections CRUD.
  - Add authentication (token-based or OAuth2) for secure access.
  - In the extension, add logic to sync local data with the backend API.
  - Handle offline mode and conflict resolution.

## 7. Chrome Extension Requirements
- `manifest.json` must specify:
  - Manifest version (v3 recommended)
  - Permissions: `storage`, `activeTab`, (optionally `identity` for auth)
  - Action: `default_popup` set to `popup.html`
- Follow Chrome Web Store policies for privacy and permissions.

## 8. Testing & Debugging
- Test the extension in Chrome (load unpacked extension from the new folder).
- Test all features: note CRUD, section management, voice input, UI responsiveness.
- Test on different OSes and Chrome versions.

## 9. Packaging & Publishing
- Package the extension as a ZIP for distribution.
- Prepare screenshots, icons, and a description for the Chrome Web Store.
- Submit for review and address any feedback from Google.

## 10. Documentation
- Write a README for the extension repo with setup, usage, and troubleshooting.
- Document any differences or limitations compared to the web app.

## Actionable Tasks

### Project Setup
- [ ] Create a new folder/repo for the Chrome extension (e.g., `notetaker-extension/`).
- [ ] Initialize the project with a README and .gitignore.

### Chrome Extension Boilerplate
- [ ] Create `manifest.json` with required permissions and metadata.
- [ ] Create `popup.html` for the main UI.
- [ ] Create `popup.js` for UI logic and speech recognition.
- [ ] Create `popup.css` for styling.
- [ ] (Optional) Create `background.js` for background tasks.

### UI/UX Implementation
- [ ] Design sidebar for sections and notes with dropdowns and icons.
- [ ] Design main panel for note details and forms.
- [ ] Add microphone icons for voice input on all fields.
- [ ] Implement truncation, tooltips, and UI polish.

### Feature Implementation
- [ ] Implement CRUD operations for notes and sections in `popup.js`.
- [ ] Implement section dropdowns and note grouping.
- [ ] Implement edit/delete for sections (with 'Uncategorized' handling).
- [ ] Implement quick delete for notes in the sidebar.

### Data Storage
- [ ] Implement storage using `chrome.storage.local` or `IndexedDB`.
- [ ] Structure and migrate data as needed.

### Voice Recognition
- [ ] Integrate Web Speech API for speech-to-text in all note fields.
- [ ] Provide visual feedback and error handling for speech input.

### Sync with Web App (Optional)
- [ ] Expose REST API in Flask app for notes/sections CRUD.
- [ ] Add authentication for secure API access.
- [ ] Implement sync logic in the extension.
- [ ] Handle offline mode and conflict resolution.

### Testing & Debugging
- [ ] Load the extension in Chrome and test all features.
- [ ] Test on different OSes and Chrome versions.
- [ ] Debug and fix any issues found during testing.

### Packaging & Publishing
- [ ] Prepare extension assets (icons, screenshots, description).
- [ ] Package the extension as a ZIP file.
- [ ] Submit to the Chrome Web Store and address feedback.

### Documentation
- [ ] Write a README for the extension with setup, usage, and troubleshooting.
- [ ] Document any differences or limitations compared to the web app.

---
This plan provides a step-by-step approach to porting the Notetaker web app to a Chrome extension with full feature parity, local storage, and voice recognition. Future enhancements can include cloud sync, user authentication, and advanced integrations.
