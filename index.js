// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Create animal schema
const animalSchema = new mongoose.Schema({
  name: String,
  species: String,
  age: Number,
});

// Create animal model
const Animal = mongoose.model("Animal", animalSchema);

// Create Express app
const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Hello world");
});
// GET all animals
app.get("/animals", async (req, res) => {
  const animals = await Animal.find();
  res.send(animals);
});

// POST - Add a new animal
app.post("/animals", async (req, res) => {
  const animal = new Animal({
    name: req.body.name,
    species: req.body.species,
    age: req.body.age,
  });
  await animal.save();
  res.send(animal);
});

// PUT - Update an existing animal
app.put("/animals/:id", async (req, res) => {
  const animal = await Animal.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      species: req.body.species,
      age: req.body.age,
    },
    { new: true }
  );

  if (!animal)
    return res.status(404).send("The animal with the given ID was not found.");

  res.send(animal);
});

// DELETE - Remove an animal
app.delete("/animals/:id", async (req, res) => {
  const animal = await Animal.findByIdAndRemove(req.params.id);

  if (!animal)
    return res.status(404).send("The animal with the given ID was not found.");

  res.send(animal);
});

// Set port and start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
