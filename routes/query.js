var express = require('express');
var MetroManager = require('../app/MetroManager')

var router = express.Router();

let metroManager = new MetroManager('./assets/metro/')

router.get('/route', function (req, res, next) {
    let {
        departure,
        arrival,
        time,
        sens
    } = req.query

    if (typeof departure !== 'string' ||
        typeof arrival !== 'string' ||
        typeof sens !== 'string' ||
        typeof time !== 'object')
        return res.status(500).send('parameters not valid')

    departure = departure.trim().toLowerCase()
    arrival = arrival.trim().toLowerCase()

    let isLeaving = sens == 'now' || sens == 'leave'
    let hasLabel = {
        departure: metroManager.hasLabel(departure),
        arrival: metroManager.hasLabel(arrival)
    }

    if (hasLabel.arrival && hasLabel.departure) {
        let nd1 = metroManager.getNodeByLabel(departure)
        let nd2 = metroManager.getNodeByLabel(arrival)
        if (nd1 != nd2) {
            let path = metroManager.buildPath(nd1, nd2, isLeaving, time).pack()
            return res.render('partials/path', path)
        }
        return res.status(500).send('departure and arrival are the same')
    }
    return res.status(500).json(hasLabel)
});

router.get('/route-pure', function (req, res, next) {
    let {
        departure,
        arrival,
        time,
        sens
    } = req.query

    if (typeof departure !== 'string' ||
        typeof arrival !== 'string' ||
        typeof sens !== 'string' ||
        typeof time !== 'object')
        return res.status(500).send('not valid')

    departure = departure.trim().toLowerCase()
    arrival = arrival.trim().toLowerCase()

    let isLeaving = sens == 'now' || sens == 'leave'
    let hasLabel = {
        departure: metroManager.hasLabel(departure),
        arrival: metroManager.hasLabel(arrival)
    }

    if (hasLabel.arrival && hasLabel.departure) {
        let nd1 = metroManager.getNodeByLabel(departure)
        let nd2 = metroManager.getNodeByLabel(arrival)
        let path = metroManager.buildPath(nd1, nd2, isLeaving, time).pack()
        res.send(path)
    } else
        res.status(500).json(hasLabel)
});

router.get('/search', function (req, res, next) {
    if (typeof req.query.location !== 'string')
        return res.status(500).send('not valid')
    let location = req.query.location.trim().toLowerCase()
    let suggestions = metroManager.suggestions(location, 10)
    res.send(suggestions)
});

router.get('/graph.json', function (req, res, next) {
    res.send(metroManager.jsonGraph())
});

module.exports = router