// popup.js - Notetaker Chrome Extension
// This file will handle UI rendering, CRUD logic

// Mock data for sections and notes
const mockSections = [
  { id: 1, name: 'Module 1' },
  { id: 2, name: 'Module 2' },
  { id: 3, name: 'Uncategorized' }
];
const mockNotes = [
  { id: 1, title: 'Intro to Python', sectionId: 1, content: 'Learn Python basics, syntax, and variables.', keywords: 'python, basics, syntax', summary: 'Introduction to Python programming.', createdAt: '2025-04-01' },
  { id: 2, title: 'Flask Basics', sectionId: 1, content: 'Understand Flask routing and templates.', keywords: 'flask, web, routing', summary: 'Getting started with Flask.', createdAt: '2025-04-05' },
  { id: 3, title: 'Advanced SQL', sectionId: 2, content: 'Deep dive into SQL joins and indexes.', keywords: 'sql, joins, indexes', summary: 'Advanced SQL concepts.', createdAt: '2025-04-10' },
  { id: 4, title: 'General Note', sectionId: 3, content: 'This is a general note.', keywords: 'general', summary: 'Uncategorized note.', createdAt: '2025-04-15' }
];

let selectedNoteId = null;

// --- Persistent Storage Helpers ---
async function loadData() {
  return new Promise(resolve => {
    if (!chrome.storage || !chrome.storage.local) {
      resolve({ sections: mockSections, notes: mockNotes });
      return;
    }
    chrome.storage.local.get(['sections', 'notes'], (result) => {
      const sections = result.sections && result.sections.length ? result.sections : [...mockSections];
      const notes = result.notes && result.notes.length ? result.notes : [...mockNotes];
      resolve({ sections, notes });
    });
  });
}

async function saveData(sections, notes) {
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ sections, notes });
  }
}

// Add New Note button above sidebar
function renderSidebar(sections, notes) {
  let html = '<div class="sidebar">';
  html += '<h2 style="display:flex;align-items:center;justify-content:space-between;">My Notes'
  html += '<button id="new-note-btn" title="Create New Note" style="background:#1e90ff;color:#fff;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;font-size:1em;">+ New</button>';
  html += '</h2>';
  html += '<button id="new-section-btn" title="Create New Section" style="margin:12px 20px 8px 20px;width:calc(100% - 40px);background:#263143;color:#fff;border:none;border-radius:4px;padding:8px 0;cursor:pointer;font-size:1em;">+ New Section</button>';
  sections.forEach(section => {
    html += `<div class="section-group">
      <div class="section-header" data-section-id="${section.id}">
        <span class="section-name">${section.name}</span>
        <span class="section-actions">
          <button class="icon-btn edit-section-btn" aria-label="Edit section" data-section-id="${section.id}" style="background:none;border:none;cursor:pointer;padding:0;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
          </button>
          <button class="icon-btn delete-section-btn" aria-label="Delete section" data-section-id="${section.id}" style="background:none;border:none;cursor:pointer;padding:0;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </span>
        <span class="section-arrow">&#9660;</span>
      </div>
      <ul class="notes-list" id="notes-list-${section.id}">`;
    notes.filter(note => note.sectionId === section.id).forEach(note => {
      const selectedClass = note.id === selectedNoteId ? ' selected-note' : '';
      html += `<li class="note-title${selectedClass}" data-note-id="${note.id}" title="${note.title}">${note.title}
        <button class="icon-btn quick-delete-note-btn" aria-label="Delete note" data-note-id="${note.id}" style="background:none;border:none;cursor:pointer;padding:0;margin-left:auto;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </li>`;
    });
    html += '</ul></div>';
  });
  html += '</div>';
  return html;
}

function renderMainPanel(notes) {
  let note = notes.find(n => n.id === selectedNoteId);
  let html = '<div class="main-panel">';
  if (note) {
    html += `<h3 style="display:flex;align-items:center;gap:8px;">${note.title}
      <button class="icon-btn edit-note-btn" aria-label="Edit note" data-note-id="${note.id}" style="background:none;border:none;cursor:pointer;padding:0;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e90ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
      </button>
      <button class="icon-btn delete-note-btn" aria-label="Delete note" data-note-id="${note.id}" style="background:none;border:none;cursor:pointer;padding:0;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    </h3>`;
    html += `<div class="note-meta"><span class="note-section">Section ID: ${note.sectionId}</span> | <span class="note-date">${note.createdAt}</span></div>`;
    html += `<div class="note-field"><strong>Summary:</strong> <span>${note.summary}</span></div>`;
    html += `<div class="note-field"><strong>Keywords:</strong> <span>${note.keywords}</span></div>`;
    html += `<div class="note-field"><strong>Content:</strong><br><span>${note.content}</span></div>`;
  } else {
    html += '<h3>Select a note to view details</h3>';
  }
  html += '</div>';
  return html;
}

// --- Initialization with Persistent Storage ---
document.addEventListener('DOMContentLoaded', async function() {
  const data = await loadData();
  window.sections = data.sections;
  window.notes = data.notes;
  document.getElementById('app').innerHTML =
    '<div class="container-flex">' +
      '<div class="sidebar-container">' + renderSidebar(window.sections, window.notes) + '</div>' +
      '<div class="main-panel-container">' + renderMainPanel(window.notes) + '</div>' +
    '</div>';
  attachSidebarListeners();
});

function attachSidebarListeners() {
  document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', function() {
      const sectionId = this.getAttribute('data-section-id');
      const notesList = document.getElementById('notes-list-' + sectionId);
      if (notesList.style.display === 'none') {
        notesList.style.display = '';
        this.querySelector('.section-arrow').innerHTML = '&#9660;';
      } else {
        notesList.style.display = 'none';
        this.querySelector('.section-arrow').innerHTML = '&#9654;';
      }
    });
  });
  document.querySelectorAll('.note-title').forEach(noteEl => {
    noteEl.addEventListener('click', function(e) {
      selectedNoteId = parseInt(this.getAttribute('data-note-id'));
      document.querySelector('.main-panel-container').innerHTML = renderMainPanel(window.notes);
      document.querySelectorAll('.note-title').forEach(note => {
        note.classList.remove('selected-note');
      });
      this.classList.add('selected-note');
      attachMainPanelListeners();
    });
  });
  const newBtn = document.getElementById('new-note-btn');
  if (newBtn) {
    newBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      showNewNoteForm();
    });
  }
  const newSectionBtn = document.getElementById('new-section-btn');
  if (newSectionBtn) {
    newSectionBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      showNewSectionModal();
    });
  }
  document.querySelectorAll('.edit-section-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const sectionId = parseInt(this.getAttribute('data-section-id'));
      editSection(sectionId);
    });
  });
  document.querySelectorAll('.delete-section-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const sectionId = parseInt(this.getAttribute('data-section-id'));
      deleteSection(sectionId);
    });
  });
  document.querySelectorAll('.quick-delete-note-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const noteId = parseInt(this.getAttribute('data-note-id'));
      if (confirm('Delete this note?')) {
        window.notes = window.notes.filter(n => n.id !== noteId);
        saveData(window.sections, window.notes);
        document.querySelector('.sidebar-container').innerHTML = renderSidebar(window.sections, window.notes);
        document.querySelector('.main-panel-container').innerHTML = renderMainPanel(window.notes);
        attachSidebarListeners();
      }
    });
  });
  attachMainPanelListeners();
}

function attachMainPanelListeners() {
  document.querySelectorAll('.edit-note-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const noteId = parseInt(this.getAttribute('data-note-id'));
      editNote(noteId);
    });
  });
  document.querySelectorAll('.delete-note-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const noteId = parseInt(this.getAttribute('data-note-id'));
      deleteNote(noteId);
    });
  });
}

// Add styles for selected note
const style = document.createElement('style');
style.textContent = `
.note-title.selected-note {
    background: #1e90ff;
    color: #fff;
    font-weight: 600;
}
`;
document.head.appendChild(style);

// Add edit/delete note handlers
window.editNote = function(noteId) {
  const note = window.notes.find(n => n.id === noteId);
  if (!note) return;
  // Render edit form in main panel
  const html = `<div class="main-panel">
    <h3>Edit Note</h3>
    <form id="edit-note-form">
      <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" id="edit-title-field" value="${note.title}" required style="width:100%;padding:8px;margin-bottom:8px;">
      </div>
      <div class="form-group">
        <label>Summary</label>
        <input type="text" name="summary" id="edit-summary-field" value="${note.summary}" style="width:100%;padding:8px;margin-bottom:8px;">
      </div>
      <div class="form-group">
        <label>Keywords</label>
        <input type="text" name="keywords" id="edit-keywords-field" value="${note.keywords}" style="width:100%;padding:8px;margin-bottom:8px;">
      </div>
      <div class="form-group">
        <label>Content</label>
        <textarea name="content" id="edit-content-field" rows="4" style="width:100%;padding:8px;margin-bottom:8px;">${note.content}</textarea>
      </div>
      <button type="submit" style="background:#1e90ff;color:#fff;padding:10px 24px;border:none;border-radius:4px;cursor:pointer;">Save</button>
      <button type="button" id="cancel-edit-btn" style="margin-left:8px;padding:10px 24px;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
    </form>
  </div>`;
  document.querySelector('.main-panel-container').innerHTML = html;
  // Attach form listeners
  const form = document.getElementById('edit-note-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    note.title = form.title.value;
    note.summary = form.summary.value;
    note.keywords = form.keywords.value;
    note.content = form.content.value;
    saveData(window.sections, window.notes);
    // Re-render UI
    document.querySelector('.sidebar-container').innerHTML = renderSidebar(window.sections, window.notes);
    document.querySelector('.main-panel-container').innerHTML = renderMainPanel(window.notes);
    attachSidebarListeners();
  });
  document.getElementById('cancel-edit-btn').addEventListener('click', function() {
    // Re-render main panel with note details
    document.querySelector('.main-panel-container').innerHTML = renderMainPanel(window.notes);
    attachMainPanelListeners();
  });
};

window.deleteNote = function(noteId) {
  if (!confirm('Are you sure you want to delete this note?')) return;
  const noteIndex = window.notes.findIndex(n => n.id === noteId);
  if (noteIndex !== -1) {
    window.notes.splice(noteIndex, 1);
    if (selectedNoteId === noteId) {
      selectedNoteId = null;
    }
    saveData(window.sections, window.notes);
    document.querySelector('.sidebar-container').innerHTML = renderSidebar(window.sections, window.notes);
    document.querySelector('.main-panel-container').innerHTML = renderMainPanel(window.notes);
    attachSidebarListeners();
  }
};

// Add new note logic
function showNewNoteForm() {
  const html = `<div class="main-panel">
    <h3>New Note</h3>
    <form id="new-note-form">
      <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" id="note-title-field" required style="width:100%;padding:8px;margin-bottom:8px;">
      </div>
      <div class="form-group">
        <label>Section</label>
        <select name="sectionId" id="section-select" style="width:100%;padding:8px;margin-bottom:8px;">
          ${window.sections.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          <option value="__new__">+ New Section</option>
        </select>
        <input type="text" id="new-section-inline" placeholder="New section name" style="width:100%;padding:8px;margin-top:8px;display:none;">
      </div>
      <div class="form-group">
        <label>Summary</label>
        <input type="text" name="summary" id="note-summary-field" style="width:100%;padding:8px;margin-bottom:8px;">
      </div>
      <div class="form-group">
        <label>Keywords</label>
        <input type="text" name="keywords" id="note-keywords-field" style="width:100%;padding:8px;margin-bottom:8px;">
      </div>
      <div class="form-group">
        <label>Content</label>
        <textarea name="content" id="note-content-field" rows="4" style="width:100%;padding:8px;margin-bottom:8px;"></textarea>
      </div>
      <button type="submit" style="background:#1e90ff;color:#fff;padding:10px 24px;border:none;border-radius:4px;cursor:pointer;">Create</button>
      <button type="button" id="cancel-new-btn" style="margin-left:8px;padding:10px 24px;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
    </form>
  </div>`;
  document.querySelector('.main-panel-container').innerHTML = html;
  // Inline new section logic
  const sectionSelect = document.getElementById('section-select');
  const newSectionInput = document.getElementById('new-section-inline');
  sectionSelect.addEventListener('change', function() {
    if (this.value === '__new__') {
      newSectionInput.style.display = '';
      newSectionInput.focus();
    } else {
      newSectionInput.style.display = 'none';
    }
  });
  // Attach form listeners
  const form = document.getElementById('new-note-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let sectionId = parseInt(form.sectionId.value);
    // If creating a new section inline
    if (form.sectionId.value === '__new__') {
      const name = newSectionInput.value.trim();
      if (!name) {
        alert('Please enter a section name.');
        newSectionInput.focus();
        return;
      }
      const newSection = { id: Math.max(0, ...window.sections.map(s => s.id)) + 1, name };
      window.sections.push(newSection);
      sectionId = newSection.id;
      saveData(window.sections, window.notes);
    }
    const newNote = {
      id: Math.max(0, ...window.notes.map(n => n.id)) + 1,
      title: form.title.value,
      sectionId,
      summary: form.summary.value,
      keywords: form.keywords.value,
      content: form.content.value,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    window.notes.push(newNote);
    selectedNoteId = newNote.id;
    saveData(window.sections, window.notes);
    document.querySelector('.sidebar-container').innerHTML = renderSidebar(window.sections, window.notes);
    document.querySelector('.main-panel-container').innerHTML = renderMainPanel(window.notes);
    attachSidebarListeners();
  });
  document.getElementById('cancel-new-btn').addEventListener('click', function() {
    document.querySelector('.main-panel-container').innerHTML = renderMainPanel(window.notes);
    attachMainPanelListeners();
  });
};

function showNewSectionModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <h3>New Section</h3>
      <form id="new-section-form">
        <input type="text" name="name" placeholder="Section name" required style="width:100%;padding:8px;margin-bottom:12px;">
        <div style="text-align:right;">
          <button type="submit" style="background:#1e90ff;color:#fff;padding:8px 20px;border:none;border-radius:4px;cursor:pointer;">Create</button>
          <button type="button" id="cancel-new-section-btn" style="margin-left:8px;padding:8px 20px;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  // Modal styles (reuse from edit section)
  const modalStyle = document.createElement('style');
  modalStyle.textContent = `
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal {
      background: #fff; color: #222; border-radius: 8px; padding: 24px; min-width: 300px; box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    }
    .modal h3 { margin-top: 0; }
  `;
  document.head.appendChild(modalStyle);
  // Form logic
  const form = document.getElementById('new-section-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = form.name.value.trim();
    if (!name) return;
    const newSection = { id: Math.max(0, ...window.sections.map(s => s.id)) + 1, name };
    window.sections.push(newSection);
    saveData(window.sections, window.notes);
    document.body.removeChild(modal);
    document.head.removeChild(modalStyle);
    document.querySelector('.sidebar-container').innerHTML = renderSidebar(window.sections, window.notes);
    document.querySelector('.main-panel-container').innerHTML = renderMainPanel(window.notes);
    attachSidebarListeners();
  });
  document.getElementById('cancel-new-section-btn').addEventListener('click', function() {
    document.body.removeChild(modal);
    document.head.removeChild(modalStyle);
  });
}

// Placeholder handlers for now
window.editSection = function(sectionId) {
  const section = window.sections.find(s => s.id === sectionId);
  if (!section) return;
  // Show a modal for editing section name
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <h3>Edit Section</h3>
      <form id="edit-section-form">
        <input type="text" name="name" value="${section.name}" required style="width:100%;padding:8px;margin-bottom:12px;">
        <div style="text-align:right;">
          <button type="submit" style="background:#1e90ff;color:#fff;padding:8px 20px;border:none;border-radius:4px;cursor:pointer;">Save</button>
          <button type="button" id="cancel-edit-section-btn" style="margin-left:8px;padding:8px 20px;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  // Modal styles
  const modalStyle = document.createElement('style');
  modalStyle.textContent = `
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal {
      background: #fff; color: #222; border-radius: 8px; padding: 24px; min-width: 300px; box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    }
    .modal h3 { margin-top: 0; }
  `;
  document.head.appendChild(modalStyle);
  // Form logic
  const form = document.getElementById('edit-section-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    section.name = form.name.value.trim();
    saveData(window.sections, window.notes);
    document.body.removeChild(modal);
    document.head.removeChild(modalStyle);
    document.querySelector('.sidebar-container').innerHTML = renderSidebar(window.sections, window.notes);
    document.querySelector('.main-panel-container').innerHTML = renderMainPanel(window.notes);
    attachSidebarListeners();
  });
  document.getElementById('cancel-edit-section-btn').addEventListener('click', function() {
    document.body.removeChild(modal);
    document.head.removeChild(modalStyle);
  });
};

window.deleteSection = function(sectionId) {
  const section = window.sections.find(s => s.id === sectionId);
  if (!section) return;
  if (section.name === 'Uncategorized') {
    alert('The "Uncategorized" section cannot be deleted.');
    return;
  }
  if (!confirm(`Delete section "${section.name}"? All its notes will be moved to "Uncategorized".`)) return;
  // Find or create 'Uncategorized' section
  let uncategorized = window.sections.find(s => s.name === 'Uncategorized');
  if (!uncategorized) {
    uncategorized = { id: Math.max(0, ...window.sections.map(s => s.id)) + 1, name: 'Uncategorized' };
    window.sections.push(uncategorized);
  }
  // Move notes to 'Uncategorized'
  window.notes.forEach(note => {
    if (note.sectionId === sectionId) {
      note.sectionId = uncategorized.id;
    }
  });
  // Remove the section
  const idx = window.sections.findIndex(s => s.id === sectionId);
  if (idx !== -1) window.sections.splice(idx, 1);
  saveData(window.sections, window.notes);
  // Re-render UI
  document.querySelector('.sidebar-container').innerHTML = renderSidebar(window.sections, window.notes);
  document.querySelector('.main-panel-container').innerHTML = renderMainPanel(window.notes);
  attachSidebarListeners();
}

// --- Project Log Update ---
// 2025-04-20: Added persistent storage using chrome.storage.local. All notes and sections are now saved and loaded across browser sessions. All CRUD operations update storage after changes. This follows best practices for Chrome extensions and ensures a seamless user experience.
