class Vehicle {
    constructor({ id, path }) {
        this.id = id;
        this.status = STATUS_IDLE;
        this.journey = new Journey(path);
        this.lastVisitedNode = this.journey.currentPoint;
    }

    get totalRequests(){
        return this.journey.typePointMap.get(POINT_PICKUP).length;
    }
    get internalDateTime() {
        return this.journey.internalDateTime;
    }


    toString() {
        return `Vehicle  ${this.id}[${this.status}] (${getDateTimeStringFromMillis(this.journey.time)} - ${this.journey.currentPoint.id}, progress=${this.journey.currentRoute?.progress.toFixed(2)})`;
    }

    get origin() {
        return this.journey.origin;
    }

    isStillTravelingJourney() {
        return !this.journey.hasFinished();
    }

    get currentCoordinate(){
        return this.journey.currentCoordinate;
    }

    get bearing() {
        return turf.bearing(
            turf.point(this.journey.previousCoordinate),
            turf.point(this.journey.currentCoordinate)
        );
    }

    get currentPoint() {
        return this.journey.currentPoint;
    }

    get currentLineString() {
        return this.journey.currentRoute;
    }

    get load() {
        return this.journey.currentPoint.load;
    }
    get isCruising() {
        return (this.journey.pair?.properties.type === POINT_PICKUP) && this.load == 0 && !this.journey.currentPoint.stillWaitingAtLocation();
    }
    isAtOrigin() {
        return this.journey.currentPoint?.type === POINT_ORIGIN;
    }
    get isAtStop() {
        return (this.journey.currentPoint.pair === null && this.load == 0)
    }

    isTargetStop() {
        return this.journey.currentPoint.pair.type === POINT_STOP;
    }

    currentStatus() {
        if (this.load == 0) {
            let target = this.journey.currentPoint.pair;
            if (target === null) {
                return STATUS_IDLE;
            } else {
                if (this.isAtOrigin() || this.currentPoint.stillWaitingAtLocation() || this.isTargetStop())
                    return STATUS_IDLE;
                if (target.type === POINT_REB_TARGET) {
                    return STATUS_REBALANCING;
                }
                return STATUS_CRUISING;
            }
        } else {
            return STATUS_CARRYING + this.load;
        }
    }


    hasNotCompletedJourney(){
        return !this.journey.hasFinished();
    }


    isRebalancing() {
        return this.status === STATUS_REBALANCING;
    }

    updateProgressUntil(dateTimeMillis, timeStep = 1000) {

        while (this.journey.time <= dateTimeMillis && this.hasNotCompletedJourney()) {
            this.journey.processNextFeature();
            this.status = this.currentStatus();

            if (this.isRebalancing()) {
                this.journey.updateRebalancingLineStringGuideLine();
            } else {
                this.journey.removeRebalancingLineStringGuideLine();
            }
        }

    }

    get popup() {
        let str = "";
        str += "<h3>"+this.id+"</h3>";
        str += "<h4><table><tr>";
        str += "<td align='right'><b>Status:</b></td> <td>" + this.status + "</br></td></tr><tr>";
        str += "<td align='right'><b>Total requests:</b></td> <td>" + this.totalRequests + "</br></td></tr><tr>";
        // str += "<td align='right'><b>Arrival:</b></td> <td>" + this.arrival + "</br></td></tr><tr>";
        // str += "<td align='right'><b>Departure:</b></td> <td>" + this.departure + "</br></td></tr><tr>";
        // str += "<td align='right'><b>Latest:</b></td> <td>" + this.latest + "</br></td></tr><tr>";
        // str += "<td align='right'><b>Type:</b></td> <td>" + this.type + "</br></td></tr><tr>";
        // str += "<td align='right'><b>Waiting(s):</b></td> <td>" + this.totalWaitingAtPointInSecs + "</br></td></tr><tr>";
        // str += "<td align='right'><b>Service(s):</b></td> <td>" + this.totalServiceAtPointInSecs + "</br></td></tr><tr>";
        str += "</tr></table></h4>";
        return str;
    }
}
