const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the leaders to you!');
    })
    .post((req, res, next) => {
        res.end(`Will add the leader: ${req.body.name} with details: ${req.body.description}`);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res, next) => {
        res.end('Deleting all the leaders!');
    });

leaderRouter.route('/:leaderID')
    .get((req, res, next) => {
        res.end(`Will send details of the leader: ${req.params.leaderID} to you!`);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /leaders/${req.params.leaderID}`);
    })
    .put((req, res, next) => {
        res.write(`Updating the leader: ${req.params.leaderID} \n`);
        res.end(`Will update the leader: ${req.body.name} with details: ${req.body.description}`);
    })
    .delete((req, res, next) => {
        res.end(`Deleting leader: ${req.params.leaderID}`);
    });

module.exports = leaderRouter;