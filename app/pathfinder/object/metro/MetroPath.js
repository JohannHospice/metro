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

function timeAddMinutesStr(timeArray, minutes) {
    return new Range(timeArray[0].valueOf(), timeArray[1].valueOf())
        .addMinutes(minutes)
        .toString()
}

function timeRemoveMinutesStr(timeArray, minutes) {
    return new Range(timeArray[0].valueOf(), timeArray[1].valueOf())
        .removeMinutes(minutes)
        .toString()
}
/**
 * 
 * @param {MetroGraph} metroGraph 
 * @param {Path} path 
 */
function MetroPath() {
    this.route = []
}
MetroPath.from = function (path, metroGraph, time, isLeaving) {
    return (isLeaving ? MetroPath.fromLeaving : MetroPath.fromArriving)(path, metroGraph, time)
}
MetroPath.fromLeaving = function (path, metroGraph, time) {
    let metroPath = new MetroPath()

    let iTransit = 0
    let from = null
    let cor1 = []

    for (let j = 0; j < path.route.length; j++) {
        let to = path.getStep(j)
        let cor2 = metroGraph.getCorrespondances(to.node)
        if (simiArray(cor1, cor2).size <= 0) {
            iTransit = metroPath.addTransit(cor2[0]) - 1
            cor1 = cor2
        } else
            metroPath.setTransitDirection(iTransit, metroGraph.getLabel(metroGraph.getDirection(cor1[0], from.node, to.node)))
        metroPath.addStationToTransit(iTransit, to.node, metroGraph.getLabel(to.node), timeAddMinutesStr(time, to.range))
        from = to
    }
    return metroPath
}
MetroPath.fromArriving = function (path, metroGraph, time) {
    let metroPath = MetroPath.fromLeaving(path, metroGraph, time)

    let lastTransitI = metroPath.route.length - 1
    let lastStationOfLastTransitI = metroPath.route[lastTransitI].stations.length - 1

    let oldRange = path.getStep(0).range
    let timeRng = new Range(time[0], time[1])
        .removeMinutes(oldRange)
    metroPath.setStationRange(lastTransitI, lastStationOfLastTransitI, timeRng.toString())

    ;
    (function aux(i, j, stepI, oldRange, time) {
        if (j < 0) {
            i--
            if (i < 0)
                return
            j = metroPath.route[i].stations.length - 1
        }
        let newRange = path.getStep(stepI).range
        time.removeMinutes(newRange - oldRange)
        metroPath.setStationRange(i, j, time.toString())
        aux(i, j - 1, stepI + 1, newRange, time)
    })(lastTransitI, lastStationOfLastTransitI - 1, 1, oldRange, timeRng)

    return metroPath
}
MetroPath.prototype.addTransit = function (line) {
    return this.route.push(new Transit(line))
}
MetroPath.prototype.setTransitDirection = function (i, directionLabel) {
    this.route[i].setDirection(directionLabel)
}
MetroPath.prototype.getStationRange = function (i, j) {
    this.route[i].getStation(j).range
}
MetroPath.prototype.setStationRange = function (i, j, range) {
    this.route[i].setStationRange(j, range)
}

MetroPath.prototype.addStationToTransit = function (i, node, label, range) {
    this.route[i].addStation(node, label, range)
}
MetroPath.prototype.pack = function () {
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
module.exports = MetroPath