/**
 * 
 * @param {*} source 
 * @param {*} target 
 * @param {number} weight 
 */
function Edge(source, target, weight) {
    if (!typeof weight === "number")
        throw "weight is not valid"
    return {
        getSource: () => source,
        getTarget: () => target,
        getWeight: () => weight,
    }
}

module.exports = Edge