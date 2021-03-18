

class FleetStatusMap {

    constructor(fleetSize, title, divElementId) {
        this.fleetSize = fleetSize;
        this.titlePlot = title;
        this.elementId = divElementId;

        var box = document.createElement("div");
        box.setAttribute("id", this.elementId);
        box.setAttribute("class", "grapConteiner");
        //document,getElementById("main").appendChild(box);
        document.body.appendChild(box);

        this.fleetStatusMap = this.getFleetStatusMap(fleetSize);
        this.indexList = [...Array(this.fleetStatusMap.size).keys()];

    }

    updateStatusToCount(status, count) {
        this.fleetStatusMap.get(status).count = count;
    }

    plotFleetStatusAt(date) {
        var update = this.getDataPointAt(date);
        this.updateFleetStatusPlot(update);

    }

    updateFleetStatusPlot(update) {
        Plotly.extendTraces(this.elementId, update, this.indexList);
    }

    getDataPointAt(date) {

        return {
            x: Array(this.fleetStatusMap.size).fill([date]),
            y: [...this.fleetStatusMap.values()].map((e) => [e.count])
        }
    }

    getFleetStatusMap(fleetSize) {

        var fleetStatusMap = new Map();

        fleetStatusMap.set(STATUS_IDLE, { color: '#081d58ff', name: "Idle", count: fleetSize });
        fleetStatusMap.set(STATUS_REBALANCING, { color: '#e31a1cff', name: "Rebalancing", count: 0 });
        fleetStatusMap.set(STATUS_CRUISING, { color: '#ffeb2a', name: "Cruising", count: 0 });
        fleetStatusMap.set(STATUS_CARRYING + '1', { color: '#1d91c0ff', name: "Carrying 1", count: 0 });
        fleetStatusMap.set(STATUS_CARRYING + '2', { color: '#7fcdbbff', name: "Carrying 2", count: 0 });
        fleetStatusMap.set(STATUS_CARRYING + '3', { color: '#c7e9b4ff', name: "Carrying 3", count: 0 });
        fleetStatusMap.set(STATUS_CARRYING + '4', { color: '#ffffd9ff', name: "Carrying 4", count: 0 });

        return fleetStatusMap;
    }

    createFleetStatusPlot(DateTime) {

        const fontSize = 10;

        //https://plotly.com/javascript/reference/layout/
        //https://plotly.com/javascript/axes/
        //https://plotly.com/javascript/plotly-fundamentals/
        var layout = {
            // title: this.titlePlot,
            legend: {
                // y: -0.3,
                "orientation": "v"},
            margin: { r: 50, l: 50, b: 50, t: 10 },
            font: {
                family: 'Roboto',
                size: fontSize,
                color: '#2c2c2c'
            },
            yaxis: {
                title: 'Vehicle / status ratio',
                titlefont: {
                    family: 'Roboto',
                    size: fontSize+2,
                    color: 'black'
                },
                showticklabels: true,
                tickangle: 'auto',
                tickfont: {

                    // family: 'Old Standard TT, serif',
                    family: 'Roboto',
                    size: fontSize,
                    color: 'black'
                },
            },
            xaxis: {
                title: 'Time',
                titlefont: {
                    family: 'Roboto',
                    size: fontSize+2,
                    color: 'black'
                },
                showticklabels: true,
                tickangle: 0,
                tickfont: {
                    family: 'Roboto',
                    size: fontSize,
                    color: 'black'
                },
            }
        };

        let statusData = [];
        this.fleetStatusMap.forEach(function (element, key) {
            statusData.push(
                {
                    x: [DateTime],
                    y: [element.count],
                    name: element.name,
                    // mode: 'lines',
                    groupnorm: 'percent',
                    stackgroup: 'one',
                    line: { color: element.color, width: 0 }
                }
            )
            console.log(element);
        });

        // Plotly.newPlot('myDiv', data);
        var config = { responsive: true }

        Plotly.newPlot(this.elementId, statusData, layout, config);
    }
}
