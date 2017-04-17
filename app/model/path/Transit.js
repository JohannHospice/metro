'use strict'

const StationStep = require('./StationStep')
const Range = require('../Range')

function Transit(line, direction) {
    let stations = []
    return {
        addStation: function (station, range) {
            stations.push(new StationStep(station, range))
        },

        setStationRange: function (i, range) {
            stations[i].range = range
        },
        setStationLabel: function (i, label) {
            stations[i].label = label
        },
        setDirection: function (directionLabel) {
            direction = directionLabel
        },

        getSize: () => stations.length,

        getStation: (i) => stations[i],
        getStationRange: (i) => stations[i].getRange(),
        getStationNode: (i) => stations[i].getNode(),
        getStationLabel: (i) => stations[i].getLabel(),
        
        pack: function () {
            let target = stations[stations.length - 1]
            let source = stations[0]
            return {
                line: line,
                length: stations.length,
                direction: direction,
                source: source.pack(),
                target: target.pack(),
                range: Range.diff(source.range.split(':'), target.range.split(':')),
                stations: stations.map(StationStep => StationStep.pack())
            }
        }
    }
}

module.exports = Transit