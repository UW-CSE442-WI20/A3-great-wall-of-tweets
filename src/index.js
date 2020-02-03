

console.log('hello world');

const d3 = require('d3');

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1300 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
const csvFile = require('./cleaner_csv.csv');
d3.csv(csvFile).then(function(data) {
    
    // Convert to Date format
    data.forEach(function(d) {
        d.Date = parseTime(d.Date);
    });

    // Zoom feature
    var zoom = d3.zoom()
        .scaleExtent([0.5, 20])
        .extent([[0, 0], [width, height]])
        .on("zoom", updateChart);

    svg.call(zoom)

    
    // Add X axis
    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.Date; }))
        .range([0, width]);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 20])
        .range([ height, 0]);
    var yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);
    
    // Define the div for the tooltip
    var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);


    var scatter = svg.append('g')
        .attr("clip-path", "url(#clip)");

    // Add dots
    scatter.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function (d) { return "dot " + d.Date } )
        .attr("cx", function (d) { return x(d.Date); } )
        .attr("cy", function (d) { return y(d.Popularity_log); } )
        .attr("r", 3)
        .style("fill", "blue" )
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.text(d.Tweet_Text)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
    

    // Updates chart when zooming
    function updateChart() {

        // recover the new scale
        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);

        // update axes with these new boundaries
        xAxis.call(d3.axisBottom(newX))
        yAxis.call(d3.axisLeft(newY))

        // update circle position
        scatter
            .selectAll("circle")
            .attr('cx', function(d) {return newX(d.Date)})
            .attr('cy', function(d) {return newY(d.Popularity_log)});
    }
})