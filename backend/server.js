const fetch = require("node-fetch");

const cors = require('cors');
app.use(cors());

app.patch("/notes/:id", async (req, res) => {
  const note = notes.find((note) => note.id === parseInt(req.params.id));
  if (note) {
    note.text = req.body.text;

    // Fetch image from Unsplash
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
        note.text
      )}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    note.image = {
      url: data.urls.small,
      author: data.user.name,
      author_link: data.user.links.html,
    };

    res.status(200).json(note);
  } else {
    res.status(404).send();
  }
});
