function Path(length, source) {
    this.route = []
}
Path.prototype.setLength = function(length) {
    this.route = []
    for (var i = 0; i < length; i++) {
        this.addStep(-1, Infinity)
    }
}
Path.prototype.addStep = function(node, range) {
    this.route.push(new Step(node, range))
}
Path.prototype.setStep = function(i, node, range) {
    this.route[i].node = node
    this.route[i].range = range
}
Path.prototype.getStepNode = function(i) {
    return this.route[i].node
}
Path.prototype.getStepRange = function(i) {
    return this.route[i].range
}
Path.prototype.setStepRange = function(i, range) {
    this.route[i].range = range
}
Path.prototype.reverseRoute = function() {
    this.route.reverse()
}
Path.prototype.pack = function() {
    return {
        info: {
            length: this.route.length,
            source: this.route[0].node,
            target: this.route[this.route.length - 1].node,
            range: this.route[this.route.length - 1].range
        },
        route: this.route.map(step => step.pack())
    }
}

function Step(node, range) {
    this.node = node
    this.range = range
}
Step.prototype.pack = function() {
    return {
        node: this.node,
        range: this.range
    }
}

module.exports = Path