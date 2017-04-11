'use strict'

const Graph = require('./Graph.js')

function MetroGraph() {
	Graph.call(this)
	Map.prototype.hasValue = function(value) {
		let iter = this.values()
		let exist = false
		for(let next = iter.next(); !(next.done || exist); next = iter.next())
			exist = next.value == value
		return exist
	}
	Map.prototype.getKey = function(value) {
		let iter = this.entries()
		let key = null
		for(let next = iter.next(); (!next.done && key === null); next = iter.next())
			if(next.value[1] == value)
				key = next.value[0]
		return key
	}
	Map.prototype.while = function(condition, callback){
		let iter = this.entries(),
			next = iter.next()
		while(!next.done && condition(next.value)){
			callback(next.value[0], next.value[1])
			next = iter.next()
		}
	}
	this.labels = new Map()
	this.lines = new Map()
}
MetroGraph.prototype = Object.create(Graph.prototype)
MetroGraph.prototype.constructor = MetroGraph

MetroGraph.prototype.hasLabel = function(label) {
	return this.labels.hasValue(label)
}
MetroGraph.prototype.addNode = function(node, label) {
    Graph.prototype.addNode.call(this, node)
    this.labels.set(node, label)
}
MetroGraph.prototype.addLine = function(line) {
    this.lines.set(line, new Set())
}
MetroGraph.prototype.addStation = function(line, station) {
	if(!this.lines.has(line))
		this.addLine(line)
    this.lines.get(line).add(station)
}
MetroGraph.prototype.addStations = function(line, stations) {
	if(!this.lines.has(line))
		this.addLine(line)
	stations.forEach(station => this.lines.get(line).add(station))
}
MetroGraph.prototype.getLine = function(line) {
    return this.lines.get(line)
}
MetroGraph.prototype.getCorrespondances = function(station) {
    let correspondances = []
    this.lines.forEach((value, id) => {
    	if(value.some(st => st == station))
    		correspondances.push(id)
    })
    return correspondances
}
MetroGraph.prototype.getLabel = function(node) {
    return this.labels.get(node)
}
MetroGraph.prototype.getNodeByLabel = function (label) {
	return this.labels.getKey(label)
}
MetroGraph.prototype.forEachLabel = function(callback) {
    return this.labels.forEach(callback)
}
MetroGraph.prototype.whileLabel = function(condition, callback) {
	this.labels.while(condition, callback)
}
MetroGraph.prototype.toString = function() {
	let string = '{\n'
	this.forEachNodes(source => {
		string += `\t(${source}, ${this.getLabel(source)}): {`
		this.forEachEdges(source, target => 
			string += `${target}: ${this.getWeight(source, target)}, `)
		string += '},\n'
	})
	return string + '}'
}

module.exports = MetroGraph