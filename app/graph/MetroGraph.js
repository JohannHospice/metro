'use strict'

const Graph = require('./Graph.js')

function MetroGraph() {
	Graph.call(this)
	Map.prototype.hasValue = function (value) {
		let iter = this.values()
		let exist = false
		for (let next = iter.next(); !(next.done || exist); next = iter.next())
			exist = next.value == value
		return exist
	}
	Map.prototype.getKey = function (value) {
		let iter = this.entries()
		let key = null
		for (let next = iter.next();
			(!next.done && key === null); next = iter.next())
			if (next.value[1] == value)
				key = next.value[0]
		return key
	}
	Map.prototype.while = function (condition, callback) {
		let iter = this.entries(),
			next = iter.next()
		while (!next.done && condition(next.value)) {
			callback(next.value[0], next.value[1])
			next = iter.next()
		}
	}
	this.labels = new Map()
	this.lines = new Map()
}
MetroGraph.prototype = Object.create(Graph.prototype)
MetroGraph.prototype.constructor = MetroGraph

MetroGraph.prototype.hasLabel = function (label) {
	return this.labels.hasValue(label)
}
MetroGraph.prototype.addNode = function (node, label) {
	Graph.prototype.addNode.call(this, node)
	this.labels.set(node, label)
}
MetroGraph.prototype.addLine = function (line) {
	if (typeof line !== 'string' && typeof line !== 'number')
		throw 'err type form addLine MetroGraph'
	this.lines.set(line, [])
}
MetroGraph.prototype.addStation = function (line, station) {
	if (typeof station !== "string" && typeof station !== "number")
		throw 'err type form add station MetroGraph'
	if (typeof station === "string")
		station = parseInt(station, 10)
	if (!this.lines.has(line))
		this.addLine(line)
	this.lines.get(line).push(station)
}

MetroGraph.prototype.getStations = function (line) {
	return this.getLine(line)
}
MetroGraph.prototype.getLine = function (line) {
	return this.lines.get(line)
}
MetroGraph.prototype.getTransitSize = function (line) {
	return this.lines.length
}
MetroGraph.prototype.getCorrespondances = function (station) {
	let correspondances = []
	this.lines.forEach((stations, line) => {
		if (stations.some(st => st == station))
			correspondances.push(line)
	})
	return correspondances
}
MetroGraph.prototype.getLineByStations = function (st1, st2) {
	let lineFounded = null
	//change to while
	this.lines.forEach((stations, line) => {
		if (stations.some(st0 => st0 == st1) && stations.some(st0 => st0 == st2))
			lineFounded = line
	})
	return lineFounded
}
MetroGraph.prototype.getDirection = function (line, from, to) {
	let foundFrom = false
	let foundto = false
	let stations = this.getLine(line)
	for (let i = 0; i < stations.length; i++) {
		if (stations[i] == from) {
			foundFrom = true
			if (foundto) return stations[0]
		} else if (stations[i] == to) {
			foundto = true
			if (foundFrom) return stations[stations.length - 1]
		}
	}
	return -1
}
MetroGraph.prototype.getLabel = function (node) {
	return this.labels.get(node)
}
MetroGraph.prototype.getNodeByLabel = function (label) {
	return this.labels.getKey(label)
}
MetroGraph.prototype.forEachLabel = function (callback) {
	return this.labels.forEach(callback)
}
MetroGraph.prototype.whileLabel = function (condition, callback) {
	this.labels.while(condition, callback)
}
MetroGraph.prototype.toString = function () {
	let string = '{\n'
	this.forEachNodes(source => {
		string += `\t(${source}, ${this.getLabel(source)}): {`
		this.forEachEdges(source, target =>
			string += `${target}: ${this.getWeight(source, target)}, `)
		string += '},\n'
	})
	return string + '}'
}

MetroGraph.prototype.json = function () {
	let nodes = []
	this.forEachNodes((id) => nodes.push({
		id,
		label: this.getLabel(id)
	}))
	/*
		let nodesOriginal = new Map()
		let nodesfiltered = nodes.filter((nd1, i, self) => {
			let nd2Id = -1
			let iFounded = self.findIndex((nd2) => {
				if (nd2.label === nd1.label) {
					nd2Id = nd2.id;
					return true
				}
				return false
			})
			nodesOriginal.set(nd1.id, nd2Id)
			return i === iFounded
		})
	*/
	let edges = []
	this.forEachWeights((source, target, weigth) =>
		edges.push({
			id: edges.length,
			source: source,
			target: target,
			weigth,
		})
	)

	let lines = []
	this.lines.forEach((stations, line) => {
		lines.push({
			line: line,
			stations: Array.from(stations)
		})
	})
	return {
		nodes, //: nodesfiltered,
		edges,
		lines
	}
}
module.exports = MetroGraph