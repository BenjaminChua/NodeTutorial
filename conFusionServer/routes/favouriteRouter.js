const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favourites = require('../models/favourites');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .options(cors.corsWithOptions, (_req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
        .populate('user')
        .populate('dishes')
        .then((favourites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favourites);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
        .then((favourite) => {
            // user already has favourite, add more favourite dishes
            if (favourite != null) {
                for (var i = 0; i < req.body.length; i++) {
                    // if dish not already in favourites, make favourite
                    if (favourite.dishes.indexOf(req.body[i]._id) === -1) {
                        favourite.dishes.push(req.body[i]._id)
                    }
                }
                favourite.save()
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
            // user does not have favourites, create document and add favourites
            else {
                var fave = {
                    user: req.user._id,
                    dishes: []
                }
                for (var i = 0; i < req.body.length; i++) {
                    fave.dishes.push(req.body[i]._id)
                }
                Favourites.create(fave)
                .then((favourite) => {
                    console.log(`Favourites created ${favourite}`);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        })
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
        .then((favourite) => {
            // remove favourites if not already null
            if (favourite != null) {
                Favourites.deleteOne({ user: req.user._id })
                .then(() => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        })
    });

favouriteRouter.route('/:dishID')
    .options(cors.corsWithOptions, (_req, res) => {
        res.sendStatus(200);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
        .then((favourite) => {
            // user already has favourite, add more favourite dishes if not already a favourite
            if (favourite != null) {
                if (favourite.dishes.indexOf(req.params.dishID) === -1) {
                    favourite.dishes.push(req.params.dishID)
                    favourite.save()
                    .then((favourite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    }, (err) => next(err))
                    .catch((err) => next(err));
                }
                else {
                    err = new Error('Dish ' + req.params.dishID + ' is already in favourites!');
                    err.status = 403;
                    return next(err);
                }
            }
            // user does not have favourites, create document and add favourites
            else {
                var fave = {
                    user: req.user._id,
                    dishes: [ req.params.dishID ]
                }
                Favourites.create(fave)
                .then((favourite) => {
                    console.log(`Favourites created ${favourite}`);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        })
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
        .then((favourite) => {
            // remove favourite if not already null and dish is a favourite
            var dishIndex = favourite.dishes.indexOf(req.params.dishID);
            if (favourite != null && dishIndex !== -1) {
                favourite.dishes.splice(dishIndex, 1);
                favourite.save()
                .then(() => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
            else if (dishIndex === -1) {
                err = new Error('Dish ' + req.params.dishID + ' not in favourites!');
                err.status = 404;
                return next(err);
            }
        })
    });

module.exports = favouriteRouter;