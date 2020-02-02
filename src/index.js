

console.log('hello world');

const d3 = require('d3');

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("cleaner-csv.csv").then(function(data) {

    // Add X axis
    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.Date; }));
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 9])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Color scale: give me a specie name, I return a color
    var color = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica" ])
        .range([ "#440154ff", "#21908dff", "#fde725ff"])


    // Highlight the specie that is hovered
    var highlight = function(d){

        selected_specie = d.Species

        d3.selectAll(".dot")
            .transition()
            .duration(200)
            .style("fill", "lightgrey")
            .attr("r", 3)

        d3.selectAll("." + selected_specie)
            .transition()
            .duration(200)
            .style("fill", color(selected_specie))
            .attr("r", 7)
    }

    // Highlight the specie that is hovered
    var doNotHighlight = function(){
        d3.selectAll(".dot")
            .transition()
            .duration(200)
            .style("fill", "lightgrey")
            .attr("r", 5 )
    }

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        //.attr("class", function (d) { return "dot " + d. } )
        .attr("cx", function (d) { return x(d.Date); } )
        .attr("cy", function (d) { return y(d.Retweets); } )
        .attr("r", 5)
        .style("fill", "blue" )
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight )

})