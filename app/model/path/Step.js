'use strict'

const Node = require('../Node')

function Step(id, range) {
    return Object.assign(Node.call(this, id), {
        pack: function () {
            return {
                node: this.getId(),
                range: range
            }
        }
    })
}

module.exports = Step