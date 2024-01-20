const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'scripts' folder
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
