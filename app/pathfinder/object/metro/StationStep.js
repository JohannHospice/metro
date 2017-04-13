'use strict'

const Step = require('../default/Step')

function StationStep(node, label, range) {
    Step.call(this, node, range)
    this.label = label
}
StationStep.prototype = Object.create(Step.prototype)
StationStep.prototype.constructor = StationStep

StationStep.prototype.pack = function() {
    let pack = Step.prototype.pack.apply(this, arguments)
     return {
        range: pack.range,
        node: pack.node,
        label: this.label
    }
}

module.exports = StationStep