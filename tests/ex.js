require("../util/dateUtil");
const Node = require("../location");

const node = {
    "type": "Feature",
    "properties": {
        "type": "ORIGIN",
        "arrival": "2019-02-20 05:26:00",
        "departure": "2019-02-20 05:26:00",
        "duration": 1560,
        "earliest": "2019-02-20 05:00:00",
        "latest": null,
        "user_id": "-",
        "user_class": "-",
        "vehicle_load": 0,
        "network_id": 2739,
        "id": "OR-(2739)-05:26:00",
        "pair": {
            "type": "Feature",
            "properties": {
                "type": "PICKUP",
                "arrival": "2019-02-20 05:30:12",
                "departure": "2019-02-20 05:30:12",
                "duration": 294,
                "earliest": "2019-02-20 05:25:18",
                "latest": "2019-02-20 05:30:17",
                "user_id": "PU3734305-1(1005)-05:25:18",
                "user_class": "network.node.NodeSource",
                "vehicle_load": 0,
                "network_id": 1005,
                "id": "PU3734305-1(1005)-05:30:12",
                "pair": null
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-74.0115966, 40.7035182]
            }
        }
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-73.9732717, 40.7552316]
    }
};

const wp = {
    "type": "Feature",
    "properties": {
        "type": "WAYPOINT",
        "arrival": "2019-02-20 05:27:00",
        "departure": "2019-02-20 05:27:00",
        "duration": 0,
        "earliest": "2019-02-20 05:27:00",
        "latest": null,
        "user_id": "-",
        "user_class": "-",
        "vehicle_load": 0,
        "network_id": 2727,
        "id": "WP-(2727)-05:27:00",
        "pair": {
            "type": "Feature",
            "properties": {
                "type": "PICKUP",
                "arrival": "2019-02-20 05:30:12",
                "departure": "2019-02-20 05:30:12",
                "duration": 294,
                "earliest": "2019-02-20 05:25:18",
                "latest": "2019-02-20 05:30:17",
                "user_id": "PU3734305-1(1005)-05:25:18",
                "user_class": "network.node.NodeSource",
                "vehicle_load": 0,
                "network_id": 1005,
                "id": "PU3734305-1(1005)-05:30:12",
                "pair": null
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-74.0115966, 40.7035182]
            }
        }
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-73.9829135, 40.7420239]
    }
}




const r = ({ type, properties: { arrival } }) => {
    console.log(type, arrival);
}
r(node)

console.log("Origin: ", new Node(node));
console.log("WP:", new Node(wp));