const express = require('express');
const app = express();
const path = require('path');
const fs = require("fs");
const notes = require('./db/db.json');
const uuid = require('./helper/uuid.js');

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public')); // controls path

// will need this to get the  root and notes html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// will use this to update json file
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));
  
app.post('/api/notes', (req, res) => {
  const {title, text}  = req.body;

  if(title && text) {
    const newNote = {
      title,
      text,
      id: uuid()
    };
    notes.push(newNote);
   
    const reviewString = JSON.stringify(notes);

    fs.writeFile(`./db/db.json`, reviewString, (err) => 
    err ? console.log(err) : console.log(`Review for ${newNote.title} has been written to JSON file`)
     );

     const response = {
      status: 'success',
      body: newNote,
     };
     console.log(response)
     res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting')
  }
});


app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id; // getting id
  console.log(id) // confirming
  const noteDelete = notes.find(el => el.id === id) //loop through the json file, through each object in the array, using dot notation to access the element's id, then IF it match assign to variable
  const index = notes.indexOf(noteDelete)// json file, and find the index of the noteDeleted
  notes.splice(index, 1) // takes json file, splice at the index and whatever note is EQUAL to noteDeleted, 1 is how many it slices

  fs.writeFile(`./db/db.json`, JSON.stringify(notes), (err) =>  // this writeFile then updates json file with the note deleted
  err ? console.log(err) : console.log(`Review for ${id} has been deleted from JSON file`)
  );
  res.status(204).json({
    status: 'success',
    data: {
      note:null
    }
  })
});

app.listen(PORT, () =>
  console.log(`Express server listening on port http://localhost:${PORT}`)
);