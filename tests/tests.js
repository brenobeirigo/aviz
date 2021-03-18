let date1 = Date.parse("2019-02-01 23:01:00");
console.log("" + new Date(date1));


let date2 = Date.parse("2019-02-01 23:00:00");
console.log("<br>" + date2);
console.log(typeof (date2))

var res = Math.abs(date1 - date2) / 1000;
console.log(res);

var i = 0;
i++;
console.log(i);

var d = new Date(Date.parse("2019-02-20 05:00:00"));
var currentDateTimeMs = d.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' });

var currentDateTimeMs = d.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' });
console.log(currentDateTimeMs.split);

class Polygon {
    constructor(l1, l2) {
        this.l1 = l1;
        this.l2 = l2;
    }
}

class Square extends Polygon {
    constructor(length) {
        // Here, it calls the parent class' constructor with lengths
        // provided for the Polygon's width and height
        super(length, length);
        // Note: In derived classes, super() must be called before you
        // can use 'this'. Leaving this out will cause a reference error.
        this.name = 'Square';
    }

    get area() {
        return this.height * this.width;
    }
}

console.log(new Square(3));

const nodeTypeDict = new Map();
nodeTypeDict.set("PICKUP", "PICKUP")
nodeTypeDict.set("DROPOFF", "DROPOFF")
nodeTypeDict.set("WAYPOINT", "WAYPOINT")
nodeTypeDict.set("ORIGIN", "ORIGIN")
nodeTypeDict.set("REB_SOURCE", "REB_SOURCE")
nodeTypeDict.set("REB_TARGET", "REB_TARGET")
nodeTypeDict.set("STOP", "STOP")

console.log(nodeTypeDict.get("ORIGIN"))

console.assert([-93.434, 43.556] === [-93.434, 43.556], "Arrays are equal!");