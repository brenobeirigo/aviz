function coordinatesAreEqual(coord1, coord2) {
    return coord1[0] == coord2[0] || coord1[1] == coord2[1];
}

class Journey {
    constructor(geojson) {
        this.timeSteps = 0;
        this.features = new FeatureList(geojson);
        this.origin = new NodeFactory(this.features.current);
        this.currentPoint = this.origin;
        this.time = this.currentPoint.elapsedTimeAtPointMillis;
        this.typePointMap = new Map();
        this.typePointMap.set(POINT_PICKUP, []);
        this.typePointMap.set(POINT_DROPOFF, []);
        this.typePointMap.set(POINT_ORIGIN, []);
        this.typePointMap.set(POINT_REB_SOURCE, []);
        this.typePointMap.set(POINT_REB_TARGET, []);
        this.typePointMap.set(POINT_WAYPOINT, []);
        this.typePointMap.set(POINT_STOP, []);
        

        // Coordinate - previous, current, next used to calculate bearing
        this.previousCoordinate = this.currentPoint.coordinates;
        this.currentCoordinate = this.currentPoint.coordinates;

        this.pair = null;
        this.rebalancingLineString = null;
        this.rebalancingTargetPoint = null;
        this.isRebalancing = false;

        this.visitedPoints = [];
        this.visitedPointIds = [];
        this.traveledLineStringList = [];
        this.coords = [];
        this.currentRoute = null;

        // Plannned route refers to the route vehicle was following
        // before waypoint was found
        this.plannedRoute = null;
    }

    currentDateTimeMillis() {
        return this.currentPoint.elapsedTimeAtPointMillis;
    }
    processNode() {

        if (!this.alreadyVisitedCurrentPointId()) {
            this.addFeaturePoint(this.features.current);
            this.typePointMap.get(this.currentPoint.type).push(this.currentPoint);
            // console.log("NEW POINT:", this.currentPoint.id)
        }
        if (this.currentPoint.stillWaitingAtLocation()) {

            // console.log(
            //"Journey clock:",
            //getDateTimeStringFromMillis(this.currentDateTimeMillis),
            // "- Point clock:",
            // getDateTimeStringFromMillis(this.currentPoint.elapsedTimeAtPointMillis));

            this.currentPoint.incrementElapsed();
            this.time = this.currentPoint.elapsedTimeAtPointMillis;
        } else {
            this.timeSteps += this.currentPoint.elapsedTimeAtPointInSecs;
            this.previousCoordinate = this.currentCoordinate;
            this.features.increment();
            //this.currentPoint = null;
        }

    }


    finishedRoute() {
        return this.currentRoute == null;
    }

    // i = 0 - Node(stop)
    // i = 1 - Route(stop-target) - rebalancing
    // i = 2 - Node(target)
    // i = 3 - Route(stop-middle)
    // i = 4 - Node(middle)
    // i = 5 - Route(middle - Pickup)

    isOnRoute() {
        return this.currentRoute.isTravelling();
    }

    addNextRoute() {
        let route = this.addRouteFromLineString(this.features.current);
        // if (this.isRebalancing)
        //     route.lineString.properties.linestring_type = STATUS_REBALANCING
        // else
        //     route.lineString.properties.linestring_type = STATUS_CARRYING
    }
    targetIsPuDo() {
        return this.currentRoute.toPoint !== POINT_WAYPOINT && this.currentRoute.toPoint !== POINT_REB_TARGET;
    }


    stopRebalancing() {
        // Remove Rebalancion path and target
        this.removeRebalancingLineStringGuideLine();
        this.isRebalancing = false;
    }

    processRoute() {

        if (this.finishedRoute()) {
            this.addNextRoute();
            // if (this.isRebalancing && this.targetIsPuDo()) {
            //     this.stopRebalancing();
            // }

        } else {
            if (this.isOnRoute()) {

                let previousCoord = this.currentCoordinate;
                this.currentCoordinate = this.getCurrentCoordinate();

                if (!coordinatesAreEqual(this.currentCoordinate, previousCoord)) {
                    this.previousCoordinate = previousCoord;
                    // this.addCoords(this.currentCoordinate);
                    this.time += 1_000; //ms
                }

                this.currentRoute.indexCurrentCoord++;


                //map.panTo(coordinates[i]);

            } else {
                // console.log("RESETING");
                // End processing line, can go to next feature
                this.timeSteps += this.currentRoute.indexCurrentCoord + 1
                this.features.increment();
                this.currentRoute = null;

            }
        }


    }

    processNextFeature() {
        if (this.features.hasNext()) {
            // console.log(this.previousCoordinate, this.currentCoordinate);
            if (this.features.isPoint()) {
                this.processNode();
            } else if (this.features.isLineString()) {
                this.processRoute();
            }
        } else {
            console.log("Journey has finished", this);
        }

    }

    hasFinished() {
        return !this.features.hasNext();
    }

    get elapsedTimeSteps() {
        if (this.features.isPoint())
            return this.timeSteps + this.currentPoint.elapsedTimeAtPointInSecs + 1;
        return this.timeSteps + this.currentRoute.indexCurrentCoord + 1
    }

    get internalDateTime() {
        let d = new Date(Date.parse(this.origin.earliest));
        d.setSeconds(d.getSeconds() + this.elapsedTimeSteps);
        return d;
    }

    getLoad() {
        this.currentPoint.load;
    }

    getLastVisitedPointFeature() {
        return this.visitedPoints[this.visitedPoints.length - 1];
    }

    getLastVisitedPointId() {
        return this.visitedPointsIds[this.visitedPointsIds.length - 1];
    }

    getLastVisitedPointId() {
        return this.visitedPointIds.length == 1 ? this.visitedPointIds[0] : this.visitedPointIds[this.visitedPointIds.length - 1];
    }

    alreadyVisitedCurrentPoint() {

        return this.visitedPoints.length > 0 && this.features.current === this.getLastVisitedPointFeature()
    }

    alreadyVisitedCurrentPointId() {

        return this.visitedPointIds.length > 0
            && this.features.current.properties.id === this.getLastVisitedPointId()
    }

    nextCoordinateOnRoute() {
        if (this.currentRoute.isTravelling()) {
            this.currentRoute.indexCurrentCoord++;
        }
    }

    getCurrentCoordinate() {
        return this.currentRoute.currentCoordinate;
    }

    updateRebalancingLineStringGuideLine() {
        let o = this.currentCoordinate;
        if (this.pair === null) {
            console.log(this);
        }
        let d = this.pair.geometry.coordinates;
        let lineString = {
            "geometry": {
                "type": "LineString",
                "coordinates": [o, d]
            },
            "type": "Feature",
            "properties": {
                "linestring_type": LINESTRING_TYPE_REBALANCING,
            }

        };
        this.rebalancingLineString = lineString;
        this.rebalancingTargetPoint = this.pair;
        this.rebalancingTargetPoint.highlight = true;
    }

    addFeaturePoint(point) {
        this.pair = point.properties.pair;
        this.currentPoint = new NodeFactory(point);
        this.visitedPointIds.push(this.currentPoint.id);

        switch (this.currentPoint.type) {
            case POINT_DROPOFF:
            case POINT_ORIGIN:
            case POINT_PICKUP:
            case POINT_STOP:
                this.visitedPoints.push(point);
                break;
            case POINT_WAYPOINT:
                if (this.isRebalancing && this.pair.properties !== POINT_REB_TARGET) {
                    this.isRebalancing = false
                }
                break;
            case POINT_REB_SOURCE:
                this.isRebalancing = true;
                break;
        }

    }

    addCoords(coords) {
        this.coords.push(coords);
        this.traveledLineStringList[this.traveledLineStringList.length - 1].geometry.coordinates.push(coords);
    }

    removeRebalancingLineStringGuideLine() {
        this.rebalancingLineString = null;
        this.rebalancingTargetPoint = null;
    }

    addRouteFromLineString(featureLineString) {
        let route = new Route(featureLineString);
        this.currentRoute = route;
        
        // Will be filled with coordinates as the simulation goes on
        let emptyLineString = {
            geometry:  {type: "LineString", coordinates: []}
        };

        this.traveledLineStringList.push(emptyLineString);
        
        return route;
    }
}

