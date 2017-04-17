'use strict'

/**
 * 
 * @param {string} label 
 */
function Line(label) {
    // Array<Station>
    let stations = []

    return {
        add: (station) => stations.push(station),

        has: (station) => stations.some(st => st == station),

        getLabel: () => label,
        getFrom: () => stations[0],
        getTo: () => stations[stations.length - 1],
        getDirection: function (from, to) {
            if (!station.some(station => station == from) || !station.some(station => station == to))
                throw "from or to does not exists"
            let foundFrom = false
            let foundto = false
            let direction = null
            this.forEachStations(station => {
                if (station == from) {
                    foundFrom = true
                    if (foundto) direction = this.getFrom()
                } else if (station == to) {
                    foundto = true
                    if (foundFrom) direction = this.getTo()
                }
            })
            return direction
        },
        forEachStations: (callback) => stations.forEach(callback),
    }
}

module.exports = Line