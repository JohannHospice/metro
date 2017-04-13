'use strict'

Number.prototype.toStringFormated = function (length) {
    let value = this.valueOf()
    if(value <= 0) return '00'
    let str = ""
    for (let i = length - 1; value < Math.pow(10, i); i--)
        str += '0'
    str += value
    return str
}
/**
 * 
 * @param {number} minutes 
 * @param {number} hours 
 */
function Range(hours, minutes) {
    this.time = []

    if (typeof hours === 'number')
        this.time[0] = hours.valueOf()
    else if (typeof hours === 'string')
        this.time[0] = parseInt(hours, 10)

    if (typeof minutes === 'number')
        this.time[1] = minutes.valueOf()
    else if (typeof minutes === 'string')
        this.time[1] = parseInt(minutes, 10)
        
    this.correctTime()
    return this
}

/**
 * return minutes diff between two time -> [hours, minutes]
 * @param {object} splitSrc 
 * @param {object} splitTgt 
 */
Range.diff = (t1, t2) => ((t2[0] - t1[0]) * 60) + (t2[1] - t1[1])

Range.prototype.correctHours = function () {
    while (this.time[0] >= 24)
        this.time[0] -= 24
    return this
}
Range.prototype.correctTime = function () {
    while (this.time[1] >= 60) {
        this.time[1] -= 60
        this.time[0]++
    }
    this.correctHours()
    return this
}
/**
 * 
 * @param {number} minutes 
 * @param {number} hours 
 */
Range.prototype.setLeavingTime = function (minutes, hours) {
    if (typeof minutes === 'number')
        this.time[1] += minutes
    if (typeof hours === 'number')
        this.time[0] = hours
    this.correctTime()
    return this
}
/**
 * 
 * @param {number} minutes 
 * @param {number} hours 
 */
Range.prototype.setArrivalTime = function (minutes, hours) {
    if (typeof minutes === 'number')
        this.time[1] -= minutes
    if (typeof hours === 'number')
        this.time[0] = hours
    this.correctTime()
    return this
}
/**
 * 
 * @param {number} hours 
 */
Range.prototype.setHours = function (hours) {
    this.time[0] = hours
    this.correctTime()
    return this
}
/**
 * 
 * @param {number} minutes 
 */
Range.prototype.setMinutes = function (minutes) {
    this.time[1] = minutes
    this.correctTime()
    return this
}
Range.prototype.getHours = function () {
    return this.time[0]
}
Range.prototype.getMinutes = function () {
    return this.time[1]
}
Range.prototype.toString = function () {
    return this.time[0].toStringFormated(2) + ':' + this.time[1].toStringFormated(2)
}
module.exports = Range