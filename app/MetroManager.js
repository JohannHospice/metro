'use strict'

const fs = require('fs')
const MetroGraph = require('./graph/MetroGraph'),
	PathBuilder = require('./pathfinder/builder/PathBuilder'),
	MetroPath = require('./pathfinder/object/metro/MetroPath'),
	tools = require('./tools')

const REG_FILENAME_STATION = /^metro_ligne(.*?)\.stations$/
const CACHE_LIFETIME = 10000

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

	if(!fs.existsSync(paths.edges) || !fs.existsSync(paths.labels))
		throw 'finderManager: unvalable path'

	fs.readdirSync(root).forEach(filename => {
		let match = filename.match(REG_FILENAME_STATION)
		if(match)
			paths.stations[match[1]] = root + filename
	})

	this.cache = new Map()
	this.metroGraph = new MetroGraph()

	parseLabels(fs.readFileSync(paths.labels, 'utf8'))
		.forEach(label => this.metroGraph.addNode(label[0], label[1]))

	parseEdges(fs.readFileSync(paths.edges, 'utf8'))
		.forEach(edge => this.metroGraph.addEdge(edge[0], edge[1], edge[2]))
	
	Object.keys(paths.stations).forEach(line => {
		parseStation(fs.readFileSync(paths.stations[line], 'utf8'))
			.forEach(station => this.metroGraph.addStation(line, station))
	})
}

/**
 * Request managing
 */
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
    return new MetroPath(this.metroGraph, this.getCache(source).build(target), isLeaving, time)
}
/**
 * 
 * @param {String} labelReq 
 * @param {number} max 
 */ 
MetroManager.prototype.suggestions = function (labelReq, max = 100) {
	let array = []
	this.metroGraph.forEachLabel((label, node) => {
		let distance = tools.distance(labelReq, label)
		array.push({node, label, distance})
	})
	return array.filter(Boolean)
		.sort((value1, value2) => value1.distance < value2.distance ? -1 : (value1.distance > value2.distance) ? 1 : 0)
		.slice(0, max)
}

/**
 * Cache managing
 */
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

/**
 * Labels
 */
MetroManager.prototype.getLabels = function () {
	return this.metroGraph.labels
}
MetroManager.prototype.hasLabel = function (label) {
	return this.metroGraph.hasLabel(label)
}
MetroManager.prototype.getNodeByLabel = function (label) {
	return this.metroGraph.getNodeByLabel(label)
}

module.exports = MetroManager

function parseEdges(data) {
	return data.split('\n')
		.map(line => line.split(' ').map(k => parseInt(k)))
		.filter(Boolean)
}
function parseLabels(data) {
	return data.split('\n')
		.map(line => {
			let i = line.indexOf(' ')
			return [parseInt(line.slice(0, i)), line.slice(i + 1).trim().toLowerCase()]
		})
		.filter(Boolean)
}
function parseStation(data) {
	return data.split('\n')
		.map(line => line.trim())
		.filter(Boolean)
}