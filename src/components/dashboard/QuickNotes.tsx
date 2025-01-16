import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";

interface Note {
  id: number;
  text: string;
  completed: boolean;
}

export function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, text: "Follow up with Resort client", completed: false },
    { id: 2, text: "Submit project milestone", completed: true },
  ]);
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([
        ...notes,
        { id: Date.now(), text: newNote.trim(), completed: false },
      ]);
      setNewNote("");
    }
  };

  const toggleNote = (id: number) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
          />
          <Button size="icon" onClick={addNote}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-nino-bg"
            >
              <Checkbox
                checked={note.completed}
                onCheckedChange={() => toggleNote(note.id)}
              />
              <span
                className={`text-sm ${
                  note.completed ? "line-through text-nino-gray" : "text-nino-text"
                }`}
              >
                {note.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}