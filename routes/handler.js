let router = require('./index');
const { MongoClient } = require('mongodb');
let qr = require('qrcode');

//Handles the token route and redirect to the url mapped with it in the db
router.get('/:token', (req, res, next) => {
    let token = req.params.token;
    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        let db = client.db('url');
        let tokens = db.collection('tokens');
        tokens.findOne({ token: token }, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500);
            }
            else {
                if (result) {
                    res.redirect(301, result.url);
                }
                else {
                    next();
                }
            }
        });
    });
});

//Route to get the qr code for a given token
router.get('/:token/qr-code.png', (req, res, next) => {
    let token = req.params.token;
    let link = req.protocol + '://' + req.hostname + '/' + token;
    qr.toFileStream(res, link, (err) => {
        console.log(err ? err : `success in sending qr code for ${link}`);
    })
});

module.exports = router;