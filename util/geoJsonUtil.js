

function splitLineString(coordinates, numberOfSegments, left = true, right = true) {
    // console.log({ coordinates, numberOfSegments })
    if (numberOfSegments == 0) {
        console.assert(coordinates.length == 2, coordinates);
        return coordinates;
    }

    // Inclusive or exclusive?
    let startCoordinate = 1, endCoordinate = numberOfSegments;
    if (left) startCoordinate = 0;
    if (right) endCoordinate = numberOfSegments + 1;

    let line = turf.lineString(coordinates);
    let totalDistanceKm = turf.lineDistance(line);
    let lenghSegmentKm = totalDistanceKm / numberOfSegments;

    // console.log(`#Coordinates=${line}, #Dist=${totalDistanceKm.toFixed(2)}km, Duration=${numberOfSegments.toFixed(2)}s, Segments=${lenghSegmentKm}`)

    let rectCollection = [];
    for (let nSegments = startCoordinate; nSegments < endCoordinate; nSegments++) {
        let distTraveledKm = nSegments * lenghSegmentKm
        let pointOnLine = turf.along(line, distTraveledKm);
        rectCollection.push(pointOnLine.geometry.coordinates);
    }

    // console.log("Last=", line.geometry.coordinates[line.geometry.coordinates.length - 1]);
    // console.log("Last calc coord=", turf.along(line, numberOfSegments * lenghSegmentKm));
    // console.log("N. coordinates: " + rectCollection.length + " - segments: " + lenghSegmentKm + " - rects: " + numberOfSegments);

    return rectCollection;
}

class FeatureList {
    constructor(geoJson) {
        console.log(geoJson);
        this.features = geoJson.features;
        this.currentFeatureIdx = 0;
        this.preProcess();
    }

    hasNext() {
        return this.currentFeatureIdx < this.features.length;
    }

    changeDepartureAndArrivalToExpectedArrivalOfFeaturePoint(i) {
        const featurePoint = this.features[i];
        if (featurePoint.properties.arrival === null) {
            featurePoint.properties.arrival = featurePoint.properties.expected_arrival;
        }
        if (featurePoint.properties.departure === null) {
            featurePoint.properties.departure = featurePoint.properties.expected_arrival;
        }
    }

    preProcess() {
        let fPrevious = this.features[0];
        this.changeDepartureAndArrivalToExpectedArrivalOfFeaturePoint(0);
        let fNext;
        let i = 1;
        for (i = 1; i < this.features.length - 1; i++) {

            const f = this.features[i];

            fNext = this.features[i + 1];

            if (f.geometry.type === "Point") {
                // console.log("Changing point", f)
                this.changeDepartureAndArrivalToExpectedArrivalOfFeaturePoint(i);
                // console.log(">> Changed point", f)
            } else if (f.geometry.type === "LineString") {

                
                f.properties.start = fPrevious.properties.departure? fPrevious.properties.departure : fPrevious.properties.expected_arrival;

                console.assert(f.properties.start !== null, `ERROR: Departure from source is null! `, fPrevious);

                f.properties.end = fNext.properties.arrival !== null? fNext.properties.arrival : fNext.properties.expected_arrival;
                console.assert(f.properties.end !== null, f, `ERROR: Arrival at target is null! `, fNext);

                f.properties.travel_time = secondsBetweenDateTimes(
                    f.properties.start,
                    f.properties.end,
                )

                console.assert(f.properties.travel_time >= 0, "ERROR: Travel time <= 0," + f)
                
                f.geometry.coordinates = splitLineString(
                    f.geometry.coordinates,
                    f.properties.travel_time);
            }
            fPrevious = f;
        }
    }

    get progress() {

        if (!this.hasNext()) {
            return 1;
        }

        let total = this.features.length;
        let cur = this.currentFeatureIdx + 1;
        return parseFloat(cur / total)
    }

    toString() {
        let total = this.features.length;

        if (this.isEmpty()) {
            return "Finished processing" + total + " features"
        }
        let cur = this.currentFeatureIdx + 1;
        let progress = this.progress.toFixed(2) + "%";
        return this.type + "[" + cur + "/" + total + "]" + "(" + progress + ")";
    }

    get type() {
        return this.current.geometry.type;
    }

    getAllCoordinates() {
        let coords = [];

        for (let f of this.features) {

            if (f.geometry.type == "Point") {
                let node = new NodeFactory(f);
                if (!(node instanceof NodeTarget)) {
                    Array.prototype.push.apply(coords, [node.coordinates]);
                }

            } else {
                let route = new RouteFactory(f);
                Array.prototype.push.apply(coords, route.coordinates);
            }

        }

        return coords;
    }


    isPoint() {
        if (!this.current) {
            console.log(this.current);
        }
        return this.current.geometry.type === "Point";
    }

    isLineString() {
        return this.current.geometry.type === "LineString";
    }

    get current() {
        return this.features[this.currentFeatureIdx];
    }


    increment() {
        this.currentFeatureIdx++;
    }
}