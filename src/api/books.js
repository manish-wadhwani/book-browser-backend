const express = require('express');
const axios = require('axios');
const parseString = require('xml2js').parseString;
const router = express.Router();
const config = require("../config/config")

router.get("/searchBooks", (req, res) => {

    axios.get("https://www.goodreads.com/search.xml", { params: { key: config.goodReadKey, q: req.query.q } })
        .then(response => {
            // parsing XML to json
            let dataToBeSent = [];

            parseString(response.data, (err, result) => {
                const bookData = result.GoodreadsResponse.search[0].results[0].work;
                bookData.forEach((book) => {
                    let currentBook = {};
                    currentBook.id = book.id[0]._;
                    currentBook.title = book.best_book[0].title[0];
                    currentBook.author = book.best_book[0].author[0].name[0];
                    currentBook.smallImageURL = book.best_book[0].small_image_url[0];
                    currentBook.imageURL = book.best_book[0].image_url[0];
                    currentBook.ratingsCount = book.ratings_count[0]._;
                    currentBook.reviewsCount = book.text_reviews_count[0]._;
                    currentBook.averageRating = book.average_rating[0];
                    currentBook.ISBN = book.best_book[0].id[0]._;
                    dataToBeSent.push(currentBook)

                })

                res.status(200).json(dataToBeSent);
            })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error.message);
        })


});


// Route to get description for a particular book based on ISBN
router.get("/description/:ISBN", (req, res) => {

    axios.get(" https://www.goodreads.com/book/isbn/" + req.params.ISBN, { params: { key: config.goodReadKey } })
        .then(response => {
            parseString(response.data, (err, result) => {

                res.status(200).json(result.GoodreadsResponse.book[0].description[0])
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error.message);
        })

})



module.exports = router