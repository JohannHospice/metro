'use strict'

const Transit = require('./Transit')
const Range = require('../Range')

/**
 * 
 * @param {object} arr1 
 * @param {object} arr2 
 */
function simiArray(arr1, arr2) {
    let simi = new Set()
    for (let i = 0; i < arr1.length; i++) {
        let found = false
        let j = 0
        while (j < arr2.length && !found) {
            if (arr1[i] === arr2[j]) {
                simi.add(arr1[i])
                found = true
            }
            j++
        }
    }
    return simi
}
/**
 * 
 * @param {MetroGraph} metroGraph 
 * @param {Path} path 
 */
function MetroPath(metroGraph, path, isLeaving, time, penetration = 1) {
    function buildRangeStr(stepRng) {
        let range = new Range(time[0].valueOf(), time[1].valueOf())
        isLeaving ? range.setLeavingTime(stepRng) : range.setArrivalTime(stepRng)
        return range.toString() 
    }
    if (!(path && metroGraph))
        throw "rrrr"

    this.route = []
    let iTransit = 0
    let step = path.getStep(0)
    let fromLabel = metroGraph.getLabel(step.node)
    let fromNd = step.node

    let cor1 = metroGraph.getCorrespondances(fromNd)
    let line = cor1[0]
    this.addTransit(line)

    let timeStr = buildRangeStr(step.range)
    this.addStationToTransit(iTransit, fromNd, fromLabel, timeStr)

    for (let j = 1; j < path.route.length; j++) {
        step = path.getStep(j)
        let toNd = step.node
        let toLabel = metroGraph.getLabel(toNd)
        timeStr = buildRangeStr(step.range)

        let cor2 = metroGraph.getCorrespondances(toNd)
        let simi = simiArray(cor1, cor2)
        if (simi.size <= 0) {
            iTransit = this.addTransit(cor2[0]) - 1
            line = cor2[0]
            cor1 = cor2
            /*
            timeStr = (function (stepRng) {
                let timeNonStr = timeStr.split(':')
                let range = new Range(timeNonStr[0], timeNonStr[1])
                return (isLeaving ? range.setLeavingTime(stepRng) : range.setArrivalTime(stepRng)).toString() 
            })(penetration)
            */
        } else {
            let directionLabel = metroGraph.getLabel(metroGraph.getDirection(line, fromNd, toNd))
            this.setTransitDirection(iTransit, directionLabel)
        }
        this.addStationToTransit(iTransit, toNd, toLabel, timeStr)
        fromNd = toNd
    }
}
MetroPath.prototype.addTransit = function (line) {
    return this.route.push(new Transit(line))
}
MetroPath.prototype.setTransitDirection = function (i, directionLabel) {
    this.route[i].setDirection(directionLabel)
}

MetroPath.prototype.addStationToTransit = function (i, node, label, range) {
    this.route[i].addStation(node, label, range)
}
/**
 * Repare beaucoup de problemes
 */
MetroPath.prototype.pack = function () {
    let lastTransit = this.route[this.route.length - 1]

    let target = lastTransit.getStation(lastTransit.getSize() - 1)
    let source = this.route[0].getStation(0)
    let route = this.route.filter(transit => transit.getSize() > 1 )
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
module.exports = MetroPath