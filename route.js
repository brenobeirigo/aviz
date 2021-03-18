class Route {
    constructor({properties, geometry}) {
        this.fromPoint = properties.from;
        this.toPoint = properties.to;
        this.coordinates = geometry.coordinates;
        this.duration = properties.distance_s;
        this.indexCurrentCoord = 0;
    }

    get type() {
        if (this.fromPoint === POINT_PICKUP && this.toPoint === "to") {
            return "carrying";
        }

    }
    get progress() {
        
        let cur = this.indexCurrentCoord + 1;
        let total = this.coordinates.length;
        return parseFloat(cur / total);
    }
    toString() {
        let cur = this.indexCurrentCoord + 1;
        let total = this.coordinates.length;
        let progress = this.progress.toFixed(2) + "%";
        return "Route[" + cur + "/" + total + "]" + "(" + progress + ") - " + this.fromPoint + " - " + this.toPoint;
    }

    isTravelling() {
        return this.indexCurrentCoord < this.coordinates.length;
    }

    get currentCoordinate() {
        return this.coordinates[this.indexCurrentCoord];
    }
}


class RouteFactory {
    constructor(route) {
        return new Route(route);

        //if (route.properties.to === nodeTypeDict["REB_TARGET"]) {
        //    debugger
        //    return new RouteRebalancing(route);
        //} else {
        //    return new Route(route);
        // }
    }
}
