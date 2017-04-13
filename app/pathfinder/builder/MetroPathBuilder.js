'use strict'

const MetroGraph = require('../object/metro/MetroGraph')
const PathBuilder = require('./PathBuilder')

function MetroPathBuilder(length, source) {
    this.finder = new MetroPath()
    this.source = -1
    this.length = -1
    if(length) {
        this.setLength(length)
        if(source) this.setSource(source)
    }
}
MetroPathBuilder.prototype = Object.create(PathBuilder.prototype)
MetroPathBuilder.prototype.constructor = MetroPathBuilder

MetroPathBuilder.prototype.djikstra = function (metroGraph, peneration = 1) {
    if (this.source < 0 || this.length < 0)
        throw "source or length uninitialize"

    let queue = new Set(metroGraph.nodes)
    while (queue.size > 0) {
        let nd1Rng = Infinity,
            nd1 = -1
        queue.forEach(nd2 => {
            if (this.finder.getStepRange(nd2) < nd1Rng) {
                nd1Rng = this.finder.getStepRange(nd2)
                nd1 = nd2
            }
        })
        queue.delete(nd1)
        metroGraph.forEachEdges(nd1, (nd2, weight) => {
            let rng = nd1Rng + weight
            if (this.finder.getStepRange(nd2) > rng) {
                this.finder.setStep(nd2, nd1, rng)
            }
        })
    }
    return this
}
MetroPathBuilder.prototype.build = function (target) {
    return this
}

module.exports = MetroPathBuilder