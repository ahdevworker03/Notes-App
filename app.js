(function () {
  const STORAGE_KEY = 'notes_app_data';
  const CHAR_LIMIT = 300;
  let notes = [];
  let editingId = null;

  const addNoteBtn = document.getElementById('add-note-btn');
  const notesContainer = document.getElementById('notes-container');
  const emptyState = document.getElementById('empty-state');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalInput = document.getElementById('modal-input');
  const charCount = document.getElementById('char-count');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');

  const getNotesFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const saveNotesToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  };

  const renderNotes = () => {
    notesContainer.innerHTML = '';

    if (notes.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    const reversedNotes = [...notes].reverse();

    reversedNotes.forEach(note => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.dataset.id = note.id;

      const date = new Date(note.createdAt);
      const formattedDate = date.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', '') + ' · ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

      const finalDate = date.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }) + ' · ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      card.innerHTML = `
        <p class="note-text">${note.text}</p>
        <span class="note-date">${finalDate}</span>
        <div class="card-actions">
          <button class="edit-btn" data-id="${note.id}">Edit</button>
          <button class="delete-btn" data-id="${note.id}">Delete</button>
        </div>
      `;
      notesContainer.appendChild(card);
    });
  };

  const openModal = (mode, currentText = '') => {
    modalTitle.textContent = mode === 'add' ? 'Add Note' : 'Edit Note';
    modalInput.value = currentText;
    charCount.textContent = `${currentText.length} / ${CHAR_LIMIT}`;
    modalOverlay.classList.remove('hidden');
    modalInput.focus();
  };

  const closeModal = () => {
    modalOverlay.classList.add('hidden');
    modalInput.value = '';
    editingId = null;
  };

  const addNote = (text) => {
    const trimmedText = text.trim();
    if (!trimmedText || trimmedText.length > CHAR_LIMIT) return;

    const newNote = {
      id: Date.now(),
      text: trimmedText,
      createdAt: new Date().toISOString()
    };

    notes.push(newNote);
    saveNotesToStorage();
    renderNotes();
  };

  const editNote = (id, newText) => {
    const trimmedText = newText.trim();
    const note = notes.find(n => n.id === Number(id));
    if (note) {
      note.text = trimmedText;
      saveNotesToStorage();
      renderNotes();
    }
  };

  const deleteNote = (id) => {
    notes = notes.filter(n => n.id !== Number(id));
    saveNotesToStorage();
    renderNotes();
  };

  addNoteBtn.addEventListener('click', () => {
    editingId = null;
    openModal('add');
  });

  modalInput.addEventListener('input', () => {
    charCount.textContent = `${modalInput.value.length} / ${CHAR_LIMIT}`;
  });

  modalConfirmBtn.addEventListener('click', () => {
    const text = modalInput.value.trim();

    if (!text) {
      modalInput.classList.add('shake');
      setTimeout(() => {
        modalInput.classList.remove('shake');
      }, 500);
      return;
    }

    if (editingId === null) {
      addNote(text);
    } else {
      editNote(editingId, text);
    }

    closeModal();
  });

  modalCancelBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  notesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const id = Number(e.target.dataset.id);
      deleteNote(id);
    } else if (e.target.classList.contains('edit-btn')) {
      const id = Number(e.target.dataset.id);
      const note = notes.find(n => n.id === id);
      if (note) {
        editingId = id;
        openModal('edit', note.text);
      }
    }
  });

  notes = getNotesFromStorage();
  renderNotes();
  modalOverlay.classList.add('hidden');
})();
