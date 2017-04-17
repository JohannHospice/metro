'use strict'

const Station = require('./Station')
const Edge = require('./Edge')
const Line = require('./Line')


function Metro() {
    // Map<number: Node>
    let nodes = new Map()

    // Map<number, Map<number, Edge>>
    let edges = new Map()

    // Map<string: Line>
    let lines = new Map()

    return {
        addNode(id, label) {
            if (!typeof id === 'number')
                throw "id is not valid"
            nodes.set(id, new Station(id, label))
            edges.set(id, new Map())
        },
        addEdge(sourceId, targetId, weight) {
            if (!nodes.has(sourceId) || !nodes.has(targetId))
                throw "source or target does not exist"
            if (!typeof weight === 'number')
                throw "weight is not valid"
            edges.get(sourceId).set(targetId, new Edge(sourceId, targetId, weight))
        },
        addLine: (label) => lines.set(label, new Line(label)),
        addStationToLine(lineLbl, nodeId) {
            if (!lines.has(lineLbl) || !nodes.has(nodeId))
                throw "line or nodeId does not exist"
            lines.get(lineLbl).add(nodes.get(nodeId))
        },
        hasLabel(label) {
            let founded = false
            nodes.forEach((node) => {
                if (!founded && node.label == label)
                    founded = true
            })
            return founded
        },
        getNodeByLabel(label) {
            let founded = null
            nodes.forEach((node) => {
                if (founded == null && node.label == label)
                    founded = node
            })
            return founded
        },
        getLabel: (nodeId) => nodes.get(nodeId).label,

        getEdges: (id) => edges.get(id),
        getEdge: (sourceId, targetId) => this.getEdges(sourceId).get(targetId),

        getLinesSize: () => lines.length,
        getLine: (label) => lines.get(label),
        getDirection: (line, from, to) => this.getLine(line).getDirection(from, to),
        getLinesByStations(st1, st2) {
            let linesFounded = []
            lines.forEach((line, label) => {
                if (line.has(st1) && line.has(st2))
                    lineFounded.push(label)
            })
            return lineFounded
        },
        getCorrespondances(station) {
            let correspondances = []
            lines.forEach((line, key) => {
                if (line.has(station))
                    correspondances.push(key)
            })
            return correspondances
        },
        getPath(source, target) {
            let paths = this.getEdges(source).map(edge => [edge])
            let visited = [];
            debugger

            while (paths.length > 0) {
                let current = paths.pop();
                let size = current.size();
                let last = current.get(size - 1);

                if (last.getToNode().equals(dest))
                    return current;
                this.extendPath(current).forEach(extend => {
                    if (!visited.contains(extend.get(extend.size() - 1)))
                        paths.addLast(extend);
                })
                visited.push(last);
            }
            return []
        },
        extendPath(path) {
            debugger
            let extendedPath = [];
            let last = path.size - 1;
            let next = path.get(last);
            this.getCorrespondances(next.getToNode())
                .forEach(result => {
                    let newPath = Array.from(path)
                    newPath.push(result)
                    extendedPath.push(newPath);
                })
            return extendedPath;
        }
    }
}

module.exports = Metro
const REG_FILENAME_STATION = /^metro_ligne(.*?)\.stations$/

const parser = require('../../tools/parser')
const fs = require('fs')

let root = "assets/metro/"
let paths = {
    edges: root + 'metro_graphe.edges',
    labels: root + 'metro_graphe.labels',
    stations: {}
}

if (!fs.existsSync(paths.edges) || !fs.existsSync(paths.labels))
    throw 'finderManager: unvalable path'

fs.readdirSync(root).forEach(filename => {
    let match = filename.match(REG_FILENAME_STATION)
    if (match)
        paths.stations[match[1]] = root + filename
})

let metro = new Metro()
parser.labels(fs.readFileSync(paths.labels, 'utf8'))
    .forEach(label => metro.addNode(label[0], label[1]))

parser.edges(fs.readFileSync(paths.edges, 'utf8'))
    .forEach(edge => metro.addEdge(edge[0], edge[1], edge[2]))

Object.keys(paths.stations)
    .forEach(label => {
        metro.addLine(label)
        parser.station(fs.readFileSync(paths.stations[label], 'utf8'))
            .forEach(station => metro.addStationToLine(label, station))
    })

metro.getPath(0,1)