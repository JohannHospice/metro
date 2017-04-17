const Node = require("./Node")

/**
 * 
 * @param {number} id 
 * @param {string} label 
 */
function Station(id, label) {
    return Object.assign(Node.call(this, id), {
        getLabel: () => label
    })
}

module.exports = Station