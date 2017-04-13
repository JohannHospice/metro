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
function MetroPath(metroGraph, path, isLeaving, time) {
    function buildRangeStr(stepRng) {
        let range = new Range(time[0].valueOf(), time[1].valueOf())
        isLeaving ? range.setLeavingTime(stepRng) : range.setArrivalTime(stepRng)
        let str = range.toString()
        return str 
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
        } else {
            let directionNd = metroGraph.getDirection(line, fromNd, toNd)
            if(!directionNd)
                debugger
            let directionLabel = metroGraph.getLabel(directionNd)
            if(!directionLabel)
                debugger
            this.setTransitDirection(iTransit, directionNd, directionLabel)
        }
        this.addStationToTransit(iTransit, toNd, toLabel, timeStr)
        fromNd = toNd
    }
}
MetroPath.prototype.addTransit = function (line) {
    return this.route.push(new Transit(line))
}
MetroPath.prototype.setTransitDirection = function (i, directionNode, directionLabel) {
    this.route[i].setDirection(directionNode, directionLabel)
}

MetroPath.prototype.addStationToTransit = function (i, node, label, range) {
    this.route[i].addStation(node, label, range)
}
MetroPath.prototype.pack = function () {
    let lastTransit = this.route[this.route.length - 1]
    let target = lastTransit.getStation(lastTransit.getSize() - 1)
    let firstTransit = this.route[0]
    let source = firstTransit.getStation(0)

    let splitSrc = source.range.split(':')
    let splitTgt = target.range.split(':')
    this.range = (splitTgt[0] - splitSrc[0]) * 60 + splitTgt[1] - splitSrc[1]
    return {
        length: this.route.length,
        source: this.route[0].getStationLabel(0),
        arrive: target.range,
        leave: source.range,
        range: this.range,
        target: target.label,
        route: this.route.map(transit => transit.pack())
    }
}
module.exports = MetroPath