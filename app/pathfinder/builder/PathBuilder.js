'use strict'

const Path = require('../object/default/Path')

function PathBuilder(length, source) {
    this.finder = new Path()
    this.source = -1
    this.length = -1
    if(length) {
        this.setLength(length)
        if(source) this.setSource(source)
    }
}
PathBuilder.prototype.setSource = function (source) {
    if(typeof source !== "number" || source < 0)
        throw "source unvalid"
    if(this.length < 0)
        throw "length undefined"

    this.source = source
    this.finder.setStepRange(source, 0)
    return this
}
PathBuilder.prototype.setLength = function (length) {
    if(typeof length !== "number" || length < 0)
        throw "length unvalid"

    this.length = length
    this.finder.setLength(length)
    return this
}
PathBuilder.prototype.djikstra = function (graph) {
    if(this.source < 0 || this.length < 0)
        throw "source or length uninitialize"

    let queue = new Set(graph.nodes)
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
        graph.forEachEdges(nd1, (nd2, weight) => {
            let rng = nd1Rng + weight
            if (this.finder.getStepRange(nd2) > rng) {
                this.finder.setStep(nd2, nd1, rng)
            }
        })
    }
    return this
}
PathBuilder.prototype.build = function(target) {
    if(typeof target !== "number" && target < 0)
        throw "target unvalid"

    let node = target
    let path = new Path()

    while(node != this.source) {
        path.addStep(node, this.finder.getStepRange(node))
        node = this.finder.getStepNode(node) 
    }
    path.addStep(this.source, 0)
    path.reverseRoute()
    return path
}

module.exports = PathBuilder