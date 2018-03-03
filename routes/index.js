const express = require('express');
let router = express.Router();
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'static/index.html'));
});

router.post('/', (req, res, next) => {
    let url = req.body.url;
    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        if (err) {
            console.log(err);
        }
        else {
            let db = client.db('url');
            function validToken(callback) {
                let token = magic();
                db.collection('tokens').find({ token: token }).toArray((err, res) => {
                    if (err) {
                        callback(err)
                    }
                    else {
                        if (res.length > 0) {
                            token = magic();
                            validToken(callback);
                        }
                        callback(null, token);
                    }
                });
            }

            validToken((err, token) => {
                if (err) {
                    console.log(err);
                }
                else {
                    db.collection('tokens').insertOne({ url: url, token: token }, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500);
                        }
                        else {
                            let link = req.protocol + '://' + req.hostname + '/' + token;
                            res.render('index.ejs', { token: token, link:link });
                        }
                    });
                }
            });

        }
    });
});

/** 
 * returns a random token of length b/w 5-7 with some magic sauce
 * @returns {string}
*/
function magic() {
    let charSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //5-7
    let n = Math.ceil(Math.random() * 3) + 4;
    let s = '';
    for (let i = 0; i < n; i++) {
        //concatenate a random char from the charSet
        s += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    return s;
}

module.exports = router;