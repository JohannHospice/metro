'use strict'

module.exports = {
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