import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Use import for node-fetch

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let notes = [
  { id: 1, text: "CPSC 2650" },
  { id: 2, text: "An awesome web dev Note" },
];

// Define API endpoints
app.get("/notes", (req, res) => {
  res.json(notes);
});

app.post("/notes", (req, res) => {
  const note = req.body;
  note.id = Date.now();
  notes.push(note);
  res.status(201).json(note);
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  notes = notes.filter((note) => note.id !== parseInt(id));
  res.status(204).end();
});

app.patch("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  notes = notes.map((note) =>
    note.id === parseInt(id) ? { ...note, text } : note
  );
  res.status(200).json(notes.find((note) => note.id === parseInt(id)));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
