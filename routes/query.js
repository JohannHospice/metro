var express = require('express');
var MetroManager = require('../app/MetroManager')

var router = express.Router();

let metroManager = new MetroManager('./assets/metro/')

router.get('/route', function (req, res, next) {
    if(typeof req.query.departure !== 'string' || typeof req.query.arrival !== 'string')
        return res.status(500).send('not valid')

    let departure = req.query.departure.trim().toLowerCase()
    let arrival = req.query.arrival.trim().toLowerCase()
    let exist = {
        departure: metroManager.hasLabel(departure),
        arrival: metroManager.hasLabel(arrival)
    }
    
    if (exist.arrival && exist.departure) {
        let nd1 = metroManager.getNodeByLabel(departure)
        let nd2 = metroManager.getNodeByLabel(arrival)
        let path = metroManager.buildPath(nd1, nd2)
        res.render('path', path)
    } else 
        res.status(500).json(exist)
});

router.get('/route-pure', function (req, res, next) {
    if(typeof req.query.departure !== 'string' || typeof req.query.arrival !== 'string')
        return res.status(500).send('not valid')

    let departure = req.query.departure.trim().toLowerCase()
    let arrival = req.query.arrival.trim().toLowerCase()
    let exist = {
        departure: metroManager.hasLabel(departure),
        arrival: metroManager.hasLabel(arrival)
    }
    
    if (exist.arrival && exist.departure) {
        let nd1 = metroManager.getNodeByLabel(departure)
        let nd2 = metroManager.getNodeByLabel(arrival)
        let path = metroManager.buildPath(nd1, nd2)
        res.send(path)
    } else 
        res.status(500).json(exist)
});

router.get('/search', function (req, res, next) {
    if(typeof req.query.location !== 'string')
        return res.status(500).send('not valid')
    let location = req.query.location.trim().toLowerCase()
    let suggestions = metroManager.suggestions(location, 0.89, 10)
    res.send(suggestions)
});

module.exports = router