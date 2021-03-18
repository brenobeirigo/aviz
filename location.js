const POINT_ORIGIN = "ORIGIN"
const POINT_PICKUP = "PICKUP"
const POINT_DROPOFF = "DROPOFF"
const POINT_STOP = "STOP"
const POINT_REB_SOURCE = "REB_SOURCE"
const POINT_WAYPOINT = "WAYPOINT"
const POINT_REB_TARGET = "REB_TARGET"

const nodeTypeDict = new Map();
nodeTypeDict.set("PICKUP", "PICKUP")
nodeTypeDict.set("DROPOFF", "DROPOFF")
nodeTypeDict.set("WAYPOINT", "WAYPOINT")
nodeTypeDict.set("ORIGIN", "ORIGIN")
nodeTypeDict.set("REB_SOURCE", "REB_SOURCE")
nodeTypeDict.set("REB_TARGET", "REB_TARGET")
nodeTypeDict.set("STOP", "STOP")

class Node {
    constructor({ properties: { id, type, earliest, arrival, departure, latest, user_id, network_id, vehicle_load, pair }, geometry: {coordinates} }) {
        this.id = id;
        this.type = type;

        this.earliest = earliest;
        this.arrival = arrival;
        this.departure = departure;
        this.latest = latest;

        this.userId = user_id;
        this.networkId = network_id;
        this.load = vehicle_load;

        this.coordinates = coordinates;

        this.elapsedTimeAtPointInSecs = 0;
        this.elapsedTimeAtPointMillis = Date.parse(this.arrival);
        this.totalWaitingAtPointInSecs = secondsBetweenDateTimes(this.earliest, this.arrival);
        this.totalServiceAtPointInSecs = secondsBetweenDateTimes(this.arrival, this.departure);
        this.pair = (pair) ? new NodeFactory(pair) : null;
    }

    get popup() {
        let str = "";
        str += "<h3>"+this.id+"</h3>";
        str += "<h4><table><tr>";
        str += "<td align='right'><b>Earliest:</b></td> <td>" + this.earliest + "</br></td></tr><tr>";
        str += "<td align='right'><b>Arrival:</b></td> <td>" + this.arrival + "</br></td></tr><tr>";
        str += "<td align='right'><b>Departure:</b></td> <td>" + this.departure + "</br></td></tr><tr>";
        str += "<td align='right'><b>Latest:</b></td> <td>" + this.latest + "</br></td></tr><tr>";
        str += "<td align='right'><b>Type:</b></td> <td>" + this.type + "</br></td></tr><tr>";
        str += "<td align='right'><b>Waiting(s):</b></td> <td>" + this.totalWaitingAtPointInSecs + "</br></td></tr><tr>";
        str += "<td align='right'><b>Service(s):</b></td> <td>" + this.totalServiceAtPointInSecs + "</br></td></tr><tr>";
        str += "</tr></table></h4>";
        return str;
    }

    stillWaitingAtLocation() {
        return this.elapsedTimeAtPointInSecs < this.totalServiceAtPointInSecs;
    }

    // incrementElapsed() {
    //     this.elapsedTimeAtPointInSecs = this.elapsedTimeAtPointInSecs + 1;
    // }

    incrementElapsed(timeStepMillis=1000) {
        this.elapsedTimeAtPointInSecs = this.elapsedTimeAtPointInSecs + 1;
        this.elapsedTimeAtPointMillis += timeStepMillis;
    }
}

class NodeOrigin extends Node {
    constructor(node) {
        super(node);
        this.elapsedTimeAtPointMillis = Date.parse(this.earliest);
    }

    stillWaitingAtLocation() {
        return this.elapsedTimeAtPointInSecs < this.totalWaitingAtPointInSecs;
    }
}

class NodeTarget extends Node {
    constructor(node) {
        super(node);
    }
}

class NodeSource extends Node {
    constructor(node) {
        super(node);
    }
}

class NodePickup extends Node {
    constructor(node) {
        super(node);
    }
}

class NodeTo extends Node {
    constructor(node) {
        super(node);
    }
}

class NodeStop extends Node {
    constructor(node) {
        super(node);
        this.elapsedTimeAtPointMillis = Date.parse(this.earliest);
    }

    stillWaitingAtLocation() {
        return this.elapsedTimeAtPointInSecs < this.totalWaitingAtPointInSecs;
    }
}

class NodeMiddle extends Node {
    constructor(node) {
        super(node);
    }
    get popup() {
        let str = "";
        str += "<h3>New assignment</h3>";
        str += "<h4><table><tr>";
        str += "<td align='right'><b>Arrival:</b></td> <td>" + this.arrival + "</br></td></tr><tr>";
        str += "<td align='right'><b>Type:</b></td> <td>" + this.type + "</br></td></tr><tr>";
        str += "<td align='right'><b>Node id:</b></td> <td>" + this.id + "</td>";
        str += "</tr></table></h4>";
        return str;
    }
}

class NodeFactory {
    constructor(node) {
        if (node.properties.type === nodeTypeDict.get("WAYPOINT")) {
            return new NodeMiddle(node);
        } else if (node.properties.type === nodeTypeDict.get("ORIGIN")) {
            return new NodeOrigin(node);
        } else if (node.properties.type === nodeTypeDict.get("REB_SOURCE")) {
            return new NodeSource(node);
        } else if (node.properties.type === nodeTypeDict.get("REB_TARGET")) {
            return new NodeTarget(node);
        } else if (node.properties.type === nodeTypeDict.get("PICKUP")) {
            return new NodePickup(node);
        } else if (node.properties.type === nodeTypeDict.get("DROPOFF")) {
            return new NodeTo(node);
        } else if (node.properties.type === nodeTypeDict.get("STOP")) {
            return new NodeStop(node);
        } else {
            return new Node(node);
        }
    }
}

// module.exports = {
//     Node,
//     NodeFactory,
//     NodeMiddle,
//     NodeOrigin,
//     NodePickup,
//     NodeStop,
//     NodeSource,
//     NodeTarget,
//     NodeTo
// }
