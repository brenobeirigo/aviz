

// TODO record = time, status, check if transition goes well from points to routes, back and forth to take pics (cover)
data = Object.entries(fleetStatus).map(([k, v]) => ({
    "status": k,
    "count": v
}));

let width = 450;
let height = 450;
let margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
let radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

let keys = data.map(d=>d.status);
console.log(keys);

// set the color scale
var color = d3.scale.ordinal()
    .domain(keys)
    .range(d3.schemeDark2);

console.log(data);
console.log(color);
let pie = d3.layout.pie().value(d=>d.cout).sort(function (a, b) { console.log(a); return d3.ascending(a.status, b.status); }) // This make sure that group order remains the same in the pie chart
var data_ready = pie(d3.entries(data))

// map to data
var u = svg.selectAll("path")
    .data(data_ready)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
u.enter()
.append('path')
.merge(u)
.transition()
.duration(1000)
.attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
)
.attr('fill', function (d) { return (color(d.data.key)) })
.attr("stroke", "white")
.style("stroke-width", "2px")
.style("opacity", 1);

// remove the group that is not present anymore
u.exit()
.remove();
