'use strict'

const Station = require('./Station')

function Transit(line) {
    this.line = line
    this.stations = []
}

Transit.prototype.addStation = function(node, label, range) {
    this.stations.push(new Station(node, label, range))
}

Transit.prototype.getStation = function(i) {
    return this.stations[i]
}
Transit.prototype.getStationRange = function(i) {
    return this.stations[i].range
}
Transit.prototype.getSize = function() {
    return this.stations.length
}
Transit.prototype.getStationNode = function(i) {
    return this.stations[i].node
}
Transit.prototype.getStationLabel = function(i) {
    return this.stations[i].label
}

Transit.prototype.setStation = function(i, node, label, range) {
    this.stations[i].node = node
    this.stations[i].label = label
    this.stations[i].range = range
}
Transit.prototype.setStationRange = function(i, range) {
    this.stations[i].range = range
}
Transit.prototype.setStationLabel = function(i, label) {
    this.stations[i].label = label
}

Transit.prototype.pack = function() {
    return {
        line: this.line,
        length: this.stations.length,
        source: this.stations[0].pack(),
        target: this.stations[this.stations.length - 1].pack(),
        range: this.stations[this.stations.length - 1].range,
        stations: this.stations.map(station => station.pack())
    }
}

module.exports = Transit