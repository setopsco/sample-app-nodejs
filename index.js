'use strict';

const express = require('express');
const morgan = require('morgan') // logging
const cowsay = require("cowsay");

// Constants
const PORT = 'PORT' in process.env ? process.env['PORT'] : '5000';
const DEFAULT_MESSAGE = 'DEFAULT_MESSAGE' in process.env ? process.env['DEFAULT_MESSAGE'] : 'Welcome to SetOps!'

// App
const app = express();

app.use(morgan('combined', {
  skip: function (_req, res) {
      return res.statusCode < 400
  }, stream: process.stderr
}));
app.use(morgan('combined', {
  skip: function (_req, res) {
      return res.statusCode >= 400
  }, stream: process.stdout
}));

app.get("/.well-known/health-check", function (_req, res) {
  res.send('ok')
})

app.get("/", function (_req, res) {
  res.redirect(`/say/${DEFAULT_MESSAGE}`);
});

app.get("/say/:text", function (req, res) {
  let text;

  try {
    // Cap text to 128 characters (security)
    text = req.params.text.substring(0, 128);
  } catch (e) {
    text = DEFAULT_MESSAGE;
  }
  let cowsayText = cowsay.say({ text })
  const responseText = `
    <pre>${cowsayText}</pre>
    <br/><br/>
  `;

  // Log the text to make it visible in the SetOps web UI & CLI
  console.log(cowsayText);

  res.send(responseText);
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
