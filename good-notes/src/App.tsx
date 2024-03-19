import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  interface Note {
    id: number;
    title: string;
    content: string;
  }

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/notes"
        );

        const notes: Note[] = await response.json();

        setNotes(notes);
      } catch (e) {
        console.log(e);
      }
    };

    fetchNotes();
  }, []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddNote = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const newNote = await response.json();

      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    } catch (e) {
      console.log(e);
    }
  };


  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNode = async (
    e: React.FormEvent,
    ) => {
    e.preventDefault();

    if(!selectedNote){
      return;
    }
    
    const updatedNote = {
      id: selectedNote.id,
      title: title,
      content: content
    }

    try {
      await fetch(
        `http://localhost:5000/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedNote),
        }
      );  
      const updatedNotesList = notes.map((note) => note.id === selectedNote.id ? updatedNote : note);

      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const deleteNote = async (
    e: React.FormEvent, 
    noteId: number
    ) => {
    e.stopPropagation();
    
    try{
      await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        { 
          method: "DELETE",
        }
      );
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
    } catch (error){
      console.log(error);
    }
  };

  return (
    <div className="app-container">
      <form
        className="note-form"
        onSubmit={(e) => selectedNote ? handleUpdateNode(e) : handleAddNote(e)}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows={10}
          required
        />
        {selectedNote ? 
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
          : 
          <button type="submit">Add Note</button>
      }
        
      </form>
      <div className="notes-grid">
        <div className="notes-grid">
          {notes.map((note) => (
            <div 
              className="note-item" 
              key={note.id}
              onClick={() => handleNoteClick(note)}
            >
              <div className="notes-header">
                <button onClick={(e) => deleteNote(e, note.id)}>x</button>
              </div>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;