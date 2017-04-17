'use strict'

const fs = require('fs')
const MetroGraph = require('./graph/MetroGraph'),
	PathBuilder = require('./pathfinder/builder/PathBuilder'),
	MetroPath = require('./pathfinder/object/metro/MetroPath'),
	tools = require('./tools')

const REG_FILENAME_STATION = /^metro_ligne(.*?)\.stations$/
const CACHE_LIFETIME = 10000

const parser = {
	labels(data) {
		// [[number, string], ...]
		return data.split('\n').map(line => {
			let i = line.indexOf(' ')
			return [parseInt(line.slice(0, i)), line.slice(i + 1).trim().toLowerCase()]
		}).filter(label => label.length == 2 && label[0] > -1 && label[1].length > 0)
	},

	edges(data) {
		// [[number, number, number], ...]
		return data.split('\n')
			.map(line => line.split(' ').map(k => parseInt(k)))
			.filter(edge => edge.length == 3 && edge[0] > -1 && edge[1] > -1 && edge[2] > -1)
	},

	station(data) {
		// [number, ...]
		return data.split('\n')
			.map(line => parseInt(line.trim()))
			.filter(station => station > -1)
	}
}

/**
 * Constructor
 * @param {String} root 
 */
function MetroManager(root) {
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

	this.cache = new Map()
	this.metroGraph = new MetroGraph()

	parser.labels(fs.readFileSync(paths.labels, 'utf8'))
		.forEach(label => this.metroGraph.addNode(label[0], label[1]))

	parser.edges(fs.readFileSync(paths.edges, 'utf8'))
		.forEach(edge => this.metroGraph.addEdge(edge[0], edge[1], edge[2]))

	Object.keys(paths.stations)
		.forEach(line => parser.station(fs.readFileSync(paths.stations[line], 'utf8'))
			.forEach(station => this.metroGraph.addStation(line, station)))
}

// Request managing
/**
 * 
 * @param {number} source 
 * @param {number} target 
 * @param {boolean} isLeaving 
 * @param {Array} time 
 */
MetroManager.prototype.buildPath = function (source, target, isLeaving, time) {
	if (!this.hasCache(source))
		this.prepareCache(source)
	return MetroPath.from(this.getCache(source).build(target), this.metroGraph, time, isLeaving)
}
/**
 * 
 * @param {String} labelReq 
 * @param {number} max 
 */
MetroManager.prototype.suggestions = function (labelReq, max = 25) {
	let suggestions = []
	this.metroGraph.forEachLabel((label) => {
		let distance = tools.distance(labelReq, label)
		suggestions.push({
			label,
			distance
		})
	})
	return suggestions.filter((thing, index, self) => self.findIndex((t) => t.label === thing.label) === index)
		.sort((val1, val2) => (val1.distance < val2.distance ? -1 : (val1.distance > val2.distance ? 1 : 0)))
		.slice(0, max)
}

// Cache managing
MetroManager.prototype.prepareCache = function (source) {
	let builder = new PathBuilder()
		.setLength(this.metroGraph.getSize())
		.setSource(source)
		.djikstra(this.metroGraph)

	this.cache.set(source, builder)

	setTimeout(() => this.deleteCache(source), CACHE_LIFETIME)
}
MetroManager.prototype.deleteCache = function (source) {
	this.cache.delete(source)
}
MetroManager.prototype.clearCache = function () {
	this.cache.clear()
}
MetroManager.prototype.getCache = function (source) {
	return this.cache.get(source)
}
MetroManager.prototype.hasCache = function (source) {
	return this.cache.has(source)
}

// Labels
MetroManager.prototype.getLabels = function () {
	return this.metroGraph.labels
}
MetroManager.prototype.hasLabel = function (label) {
	return this.metroGraph.hasLabel(label)
}
MetroManager.prototype.getNodeByLabel = function (label) {
	return this.metroGraph.getNodeByLabel(label)
}
MetroManager.prototype.jsonGraph = function () {
	return this.metroGraph.json()
}

module.exports = MetroManager