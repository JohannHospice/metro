'use strict'
const Transit = require('./Transit')

function MetroPath(source, target) {
    let route = []
    return {
        addTransit: function (lineLbl) {
            return this.route.push(new Transit(lineLbl))
        },
        setTransitDirection: function (i, directionLabel) {
            this.route[i].setDirection(directionLabel)
        },
        addStationToTransit: function (i, node, label, range) {
            this.route[i].addStation(node, label, range)
        },
        pack: function () {
            let lastTransit = this.route[this.route.length - 1]
            let target = lastTransit.getStation(lastTransit.getSize() - 1)
            let source = this.route[0].getStation(0)
            let route = this.route.filter(transit => transit.getSize() > 1)
            return {
                length: route.length,
                source: route[0].getStationLabel(0),
                arrive: target.range,
                leave: source.range,
                range: Range.diff(source.range.split(':'), target.range.split(':')),
                target: target.label,
                route: route.map(transit => transit.pack())
            }
        }
    }
}

module.exports = MetroPath