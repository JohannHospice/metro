$(document).ready(function () {
    $.ajax({
        dataType: 'json',
        url: '/query/graph.json',
        success: function (graph) {
            var elements = []
            var nodesMap = new Map()
            graph.nodes.forEach(function (node) {
                nodesMap.set(node.id, node.label)
            });
            nodesMap.forEach(function (key, value) {
                elements.push({
                    groupe: "nodes",
                    data: {
                        id: key,
                        label: value
                    },
                })
            });
            graph.edges.forEach(function (edge) {
                let line = 'l'
                graph.lines.forEach(obj => {
                    if (obj.stations.some(nd => nd == edge.source) && obj.stations.some(nd => nd == edge.source))
                        line = obj.line
                })
                l1 = nodesMap.get(edge.source)
                l2 = nodesMap.get(edge.target)
                if (l1 != l2)
                    elements.push({
                        groupe: "edges",
                        data: {
                            id: edge.id,
                            line: line,
                            source: l1,
                            target: l2,
                            weight: edge.weight,
                        }
                    })
            });
            var cy = window.cy = cytoscape({
                container: document.getElementById('container'),
                elements,
                style: [{
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'label': 'data(id)'
                    }
                }, {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle'
                    }
                }]
            });
            cy.layout({
                name: 'cose',
                ready: function () {},
                stop: function () {},
                animate: true,
                animationThreshold: 250,
                refresh: 20,
                fit: true,
                padding: 30,
                boundingBox: undefined,
                randomize: true,
                componentSpacing: 100,
                nodeRepulsion: function (node) {
                    return 400000;
                },
                nodeOverlap: 1,
                idealEdgeLength: function (edge) {
                    return 100;
                },
                edgeElasticity: function (edge) {
                    return 100;
                },
                nestingFactor: 5,
                gravity: 80,
                numIter: 1000,
                initialTemp: 200,
                coolingFactor: 0.95,
                minTemp: 1.0,
                weaver: false
            }).run()
        }
    });
})