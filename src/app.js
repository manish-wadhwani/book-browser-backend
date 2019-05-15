const express = require('express');
const cors = require('cors');

const booksRouter = require("./api/books")
const config = require("./config/config")
const app = express();

// Middleware to prevent CORS error
app.use(cors());

app.use("/books", booksRouter);

const portNumber = process.env.PORT || config.defaultPort;
app.listen(portNumber, () => {
    console.log(`server is running at ${portNumber}`)
})