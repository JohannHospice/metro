'use strict'

const Transit = require('./Transit')

function diffArray(arr1, arr2) {
    let j = 0, i = 0, diff = []
    while (i < arr1.length) {
        if (j < arr2.length && arr1[i] === arr2[j]) j++
        else diff.push(arr1[i])
        i++
    }
    return diff
}

function MetroPath(metroGraph, path) {
    if (!(path && metroGraph))
        throw "rrrr"

    this.route = []
    
    let step = path.getStep(0)

    let cor1 = metroGraph.getCorrespondances(step.node),  
        indexTransit = 0

    this.addTransit(cor1[0])
    this.addStationToTransit(indexTransit, step.node, metroGraph.getLabel(step.node), step.range)

    for (let j = 1; j < path.route.length; j++) {
        step = path.getStep(j)

        let cor2 = metroGraph.getCorrespondances(step.node)
        let diff = diffArray(cor1, cor2)
        if (diff.length > 0) {
            indexTransit = this.addTransit(diff[0]) - 1
            cor1 = cor2
        }
        this.addStationToTransit(indexTransit, step.node, metroGraph.getLabel(step.node), step.range)
    }
}
MetroPath.prototype.addTransit = function (line) {
    return this.route.push(new Transit(line))
}
MetroPath.prototype.addStationToTransit = function (i, node, label, range) {
    this.route[i].addStation(node, label, range)
}
MetroPath.prototype.pack = function () {
    let lastTransit = this.route[this.route.length - 1]
    let target = lastTransit.getStation(lastTransit.getSize() - 1)
    return {
        length: this.route.length,
        source: this.route[0].getStationLabel(0),
        range: target.range,
        target: target.label,
        route: this.route.map(transit => transit.pack())
    }
}
module.exports = MetroPath