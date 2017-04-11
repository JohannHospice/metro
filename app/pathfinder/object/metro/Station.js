'use strict'

const Step = require('../default/Step')

function Station(node, label, range) {
    Step.call(this, node, range)
    this.label = label
}
Station.prototype = Object.create(Step.prototype)
Station.prototype.constructor = Station

Station.prototype.pack = function() {
    return {
        range: this.range,
        label: this.label,
        node: this.node
    }
}

module.exports = Station