class Vehicle {
    constructor({ id, path }) {
        this.id = id;
        this.status = STATUS_IDLE;
        this.journey = new Journey(path);
        this.lastVisitedNode = this.journey.currentPoint
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
}
