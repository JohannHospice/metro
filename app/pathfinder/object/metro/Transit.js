'use strict'

const StationStep = require('./StationStep')
const Range = require('../Range')

function Transit(line) {
    this.line = line
    this.direction = 'none'
    this.stations = []
}

Transit.prototype.addStation = function(node, label, range) {
    this.stations.push(new StationStep(node, label, range))
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
Transit.prototype.setDirection = function(directionLabel) {
    this.direction = directionLabel
}
Transit.prototype.getLastStation = function() {
    return this.stations[this.stations.length - 1]
}

Transit.prototype.pack = function() {
    let target = this.stations[this.stations.length - 1]
    let source = this.stations[0]
    return {
        line: this.line,
        length: this.stations.length,
        direction: this.direction,
        source: source.pack(),
        target: target.pack(),
        range: Range.diff(source.range.split(':'), target.range.split(':')),
        stations: this.stations.map(StationStep => StationStep.pack())
    }
}

module.exports = Transit