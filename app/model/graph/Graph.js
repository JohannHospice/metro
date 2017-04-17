const Node = require("./Node")
const Edge = require("./Edge")

function Graph() {
    // Map<number, Node>
    let nodes = new Map()

    // Map<number, Map<number, Edge>>
    let edges = new Map()
    
    return {
        addNode: function (id) {
            if (!typeof id === 'number')
                throw "nodeId is not valid"
            nodes.set(id, new Node(id))
            edges.set(id, new Map())
        },
        addEdge: function (sourceId, targetId, weight) {
            if (!nodes.has(sourceId) || !nodes.has(targetId))
                throw "source or target does not exist"
            if (!typeof weight === 'number')
                throw "weight is not valid"
            edges.get(sourceId).set(targetId, new Edge(sourceId, targetId, weight))
        },
        getSize: () => nodes.size,
        getEdges: (id) => edges.get(id),
        getWeight: (sourceId, targetId) => edges.get(sourceId).get(targetId).weight,
        forEachNodes: (callback) => nodes.forEach(callback),
        forEachEdges: (source, callback) => edges.get(source).forEach(srcEdges => srcEdges.forEach(callback)),
    }
}