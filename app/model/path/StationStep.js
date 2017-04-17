'use strict'

const Station = require('../Station')

function StationStep(station, range) {
    return {
        setRange: (newRange) => range = newRange,
        pack: function () {
            return {
                range: range,
                node: station.getId(),
                label: station.getLabel()
            }
        }
    }
}

module.exports = StationStep