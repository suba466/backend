const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Multer storage setup
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // folder to store uploaded files
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique name
    }
});

const upload = multer({ storage: storage });

// Route: show upload form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

// Route: single file upload
app.post('/uploadfile', upload.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.send('No file uploaded!');
    }
    res.send(`File uploaded successfully: ${req.file.filename}`);
});

// Route: multiple file upload
app.post('/uploadmultiple', upload.array('myFiles', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.send('No files uploaded!');
    }
    const files = req.files.map(f => f.filename).join(', ');
    res.send(`Multiple files uploaded successfully: ${files}`);
});

// Route: photo upload
app.post('/uploadphoto', upload.single('myImage'), (req, res) => {
    if (!req.file) {
        return res.send('No photo uploaded!');
    }
    res.send(`Photo uploaded successfully: ${req.file.filename}`);
});

// Start server
app.listen(3000, () => console.log(`Server running on http://localhost:3000`));
