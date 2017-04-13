'use strict'

function Node(node) {
    this.node = node
}
Node.prototype.pack = function() {
    return {
        node: this.node
    }
}

module.exports = Node