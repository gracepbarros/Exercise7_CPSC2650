const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let notes = []; // Simple in-memory storage for notes

app.post("/notes", (req, res) => {
  const note = { id: Date.now(), text: req.body.text };
  notes.push(note);
  res.status(201).json(note);
});

app.delete("/notes/:id", (req, res) => {
  notes = notes.filter((note) => note.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.patch("/notes/:id", (req, res) => {
  const note = notes.find((note) => note.id === parseInt(req.params.id));
  if (note) {
    note.text = req.body.text;
    res.status(200).json(note);
  } else {
    res.status(404).send();
  }
});

app.get("/notes", (req, res) => {
  res.json(notes);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
