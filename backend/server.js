import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let notes = [];

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  const note = notes.find((note) => note.id == parseInt(id));
  if (!note) {
    res.status(404).json({ error: "Note not found" });
  } else {
    res.json(note);
  }
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

// Function to fetch images from Unsplash based on note content
const fetchImagesFromUnsplash = async (query) => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  console.log("accessKey: ", accessKey);
  const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=1`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch images from Unsplash");
    }

    const data = await response.json();
    if (data.results.length > 0) {
      const { urls, user } = data.results[0];
      return {
        imageUrl: urls.regular,
        authorName: user.name,
        authorLink: user.links.html,
      };
    } else {
      throw new Error("No images found on Unsplash for the given query");
    }
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    throw error;
  }
};

app.get("/notes/:id/image", async (req, res) => {
  try {
    const { id } = req.params;
    const note = notes.find((note) => note.id === parseInt(id));

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const { imageUrl, authorName, authorLink } = await fetchImagesFromUnsplash(
      note.text
    );

    res.json({ imageUrl, authorName, authorLink });
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    res.status(500).json({ error: "Failed to fetch image from Unsplash" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
