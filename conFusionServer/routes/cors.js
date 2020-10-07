const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://AISG-MacBook-Pro:3001'];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    // is in whitelist
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    // not in whitelist
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

// * headers
exports.cors = cors();

// restricted
exports.corsWithOptions = cors(corsOptionsDelegate);