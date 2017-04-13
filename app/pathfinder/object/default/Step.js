'use strict'

const Node = require('../Node')

function Step(node, range) {
    Node.call(this, node)
    this.range = range
}
Step.prototype = Object.create(Node.prototype)
Step.prototype.constructor = Step

Step.prototype.pack = function() {
    let pack = Node.prototype.pack.apply(this, arguments)
    return {
        node: pack.node,
        range: this.range
    }
}

module.exports = Step