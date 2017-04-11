'use strict'

function Step(node, range) {
    this.node = node
    this.range = range
}
Step.prototype.pack = function() {
    return {
        node: this.node,
        range: this.range
    }
}

module.exports = Step