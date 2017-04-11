'use strict'

function Graph() {
	this.edges = new Map()
	this.weights = new Map()
	this.nodes = new Set()
}
Graph.prototype.getWeight = function (source, target) {
	return this.weights.get(mergeNodes(source, target))
}
Graph.prototype.getSize = function () {
	return this.nodes.size()
}
Graph.prototype.getEdges = function (source) {
	return this.edges.get(source)
}
Graph.prototype.getSizeNodes = function () {
	return this.nodes.size
}
Graph.prototype.setWeight = function (source, target, weight) {
	this.weights.set(mergeNodes(source, target), weight)
}
Graph.prototype.addNode = function (node) {
	this.nodes.add(node)
	this.edges.set(node, new Set())
}
Graph.prototype.addEdge = function (source, target, weight) {
	if (!this.nodes.has(source))
		this.addNode(source)
	if (!this.nodes.has(target))
		this.addNode(target)
	this.getEdges(source).add(target)
	this.weights.set(`${source}-${target}`, weight)
}
Graph.prototype.forEachWeights = function (callback) {
	this.weights.forEach((value, key) => {
		let nodes = splitNodes(key)
		callback(nodes[0], nodes[1], value)
	})
}
Graph.prototype.forEachNodes = function (callback) {
	this.nodes.forEach(callback)
}
Graph.prototype.forEachEdges = function (source, callback) {
	this.edges.get(source).forEach(target => callback(target, this.getWeight(source, target)))
}
Graph.prototype.toString = function () {
	let string = '{\n'
	this.forEachNodes(source => {
		string += `\t${source}: {`
		this.forEachEdges(source, target => {
			string += `${target}: ${this.getWeight(source, target)}, `
		})
		string += '},\n'
	})
	return string + '}'
}

function splitNodes(nodes) {
	return nodes.split('-').map(n => parseInt(n))
}

function mergeNodes(source, target) {
	return `${source}-${target}`
}

module.exports = Graph