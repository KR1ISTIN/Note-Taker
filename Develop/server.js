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

// will need this to get the index and notes html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

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


// app.delete('/api/notes/:id', (req, res) => {

//   const id = req.params.body;
//   notes.remove(id);

//   res.send(`Youre ${id} has been deleted`)
// })



app.listen(PORT, () =>
  console.log(`Express server listening on port http://localhost:${PORT}`)
);