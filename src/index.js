const d3 = require('d3');
const csvFile = require('./cleaner_csv.csv');
const wordData = require('./words_to_id.csv');
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
var myList;

let map = new Map();

d3.csv(wordData).then(function(data) {
    for (let i = 0; i < data.length; i++) {
        // First poblate the map.
        if (!map.has(data[i].Word)) {

            // If we don't have the next word then we add it with an array.
            map.set(data[i].Word, []);
        }
        // Get the array of the word and push the date.
        map.get(data[i].Word).push(data[i].Date);
    }
});

drawScatter(myList);

// Set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1100 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var wid = width + margin.left + margin.right;
var hei = height + margin.top + margin.bottom;
var svg = d3.select("#dataviz")
    .append("svg")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', "0 0 " + wid + " " + hei)
    //.attr("width", width + margin.left + margin.right)
    //.attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


// First suggestion
d3.select("#link1")
    .on("click", function(d) {
        d3.event.preventDefault();
        d3.csv(wordData).then(function(data) {
            var americaResults = [];
            data.forEach(function(d) {
                d.Date = parseTime(d.Date);
                if (d.Word === 'makeamericagreatagain') {
                    americaResults.push(d.Date);
                }
            });

            d3.selectAll("g > *").remove();
            drawScatter(americaResults);
        })
    });

// Second suggestion
d3.select("#link2")
    .on("click", function(d) {
        d3.event.preventDefault();
        d3.csv(wordData).then(function(data) {
            var clintonResults = [];
            data.forEach(function(d) {
                d.Date = parseTime(d.Date);
                if (d.Word === 'clinton') {
                    clintonResults.push(d.Date);
                }
            });

            d3.selectAll("g > *").remove();
            drawScatter(clintonResults);
        })
    });

// Third suggestion
d3.select("#link3")
    .on("click", function(d) {
        d3.event.preventDefault();
        d3.csv(wordData).then(function(data) {
            var americaResults = [];
            data.forEach(function(d) {
                d.Date = parseTime(d.Date);
                if (d.Word === 'republican') {
                    americaResults.push(d.Date);
                }
            });

            d3.selectAll("g > *").remove();
            drawScatter(americaResults);
        })
    });



//search callback
d3.select("#form")
    .on("submit", function(d) {
        d3.event.preventDefault();
        var input = document.getElementById("input").value;
        var tokens = input.trim().split(" ");
        var searchResults = [];
        let valid = true;
        let regex = /[^A-Za-z_]/;
        for (let i = 0; i < tokens.length; i++) {
            tokens[i] = tokens[i].toLowerCase().trim().replace(regex, "");
            if (!map.has(tokens[i])) {
                valid = false;
            }
        }
        if (valid) {
            let arr = map.get(tokens[0]);
            for (let i = 0; i < arr.length; i++) {
                // So that we store a copy rather than the references themselves
                searchResults.push(arr[i]);
            }
            for (let i = 1; i < tokens.length; i++) {
                let temp = [];  // Temp variable that holds valid dates.
                let nextArray = map.get(tokens[i]);
                for (let j = 0; j < nextArray.length; j++) {
                    // Iterate through the next token's dates
                    for (let k = 0; k < searchResults.length; k++) {
                        // Iterate through the dates in search result
                        if (searchResults[k] == nextArray[j]) {
                            // only push those dates that are already in search result in temp
                            // as the results should be only the tweets that have all the words in the input.
                            temp.push(searchResults[k]);
                        }
                    }
                }
                searchResults = temp;
            }

            for (let i = 0; i < searchResults.length; i++) {
                searchResults[i] = parseTime(searchResults[i]);
            }
        }
        d3.selectAll("g > *").remove();
        //console.log(searchResults);
        if (input == "") {     // User did not input anything
            drawScatter(null);
        } else if(searchResults.length == 0){
            console.log("else if" + searchResults);
            drawScatter(searchResults, true);
        } else {
            //console.log(searchResults);
            drawScatter(searchResults);
        }
    });

// Draw scatterplot
function drawScatter(searchResults, errFlag) {
    d3.csv(csvFile).then(function (data) {
        // Convert to Date format
        data.forEach(function (d) {
            d.Date = parseTime(d.Date);
        });
        
        if(errFlag){
            d3.select("#err")
                .style("opacity", 1);
        }else{
            d3.select("#err")
                .style("opacity", 0);
        }
      

        // Zoom feature
        var zoom = d3.zoom()
            .scaleExtent([1, 20])
            //translateExtent insert bounds
            //or restrict zoom to one axis
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        //svg.call(zoom)

        // Add X axis
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.Date;
            }))
            .range([0, width]);
        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + (height - 20) + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 20])
            .range([height - 20, 0]);
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
            .style("opacity", 0)
            .style("pointer-events", "none");

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height-20)
            .attr("x", 0)
            .attr("y", 0);

        var scatter = svg.append('g')
            .attr("clip-path", "url(#clip)");

        // Text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width/2) + " ," +
                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .style("font-family", "trebuchet ms")
            .text("Date");

        // Text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-family", "trebuchet ms")
            .text("Popularity");

        //Add dots
        scatter.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(d.Date);
            })
            .attr("cy", function (d) {
                return y(d.Popularity_log);
            })
            .attr("r", 3)
            .style("fill", function(d) {
                if(searchResults == null){return "#00acee"} //"#cc2400"
                for (var i = 0; i < searchResults.length; i++) {
                    if (searchResults[i] != null && searchResults[i].getTime() === d.Date.getTime()) {
                        return "#00acee";
                    }
                }
                return "none";
            })
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.text(d.Tweet_Text)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        var scat = scatter
            .selectAll("circle");
        // Update chart when zooming
        function updateChart() {

            // Recover the new scale
            var newX = d3.event.transform.rescaleX(x);
            var newY = d3.event.transform.rescaleY(y);

            // Update axes with these new boundaries
            xAxis.call(d3.axisBottom(newX))
            yAxis.call(d3.axisLeft(newY))

            // Update circle position
            
                scat.attr('cx', function (d) {
                    return newX(d.Date)
                })
                .attr('cy', function (d) {
                    return newY(d.Popularity_log)
                });
        }
        function zoomed() {
            var newX = d3.event.transform.rescaleX(x);
            var newY = d3.event.transform.rescaleY(y);
            xAxis.call(d3.axisBottom(newX).tickFormat(function(date) {
                if (d3.event.transform.k == 1) {
                    return d3.timeFormat("%b %Y")(date);
                } else {
                    return d3.timeFormat("%b %e, %Y")(date);
                }}));
            scat.attr('cx', function (d) {
                    return newX(d.Date)
                })
                .attr('cy', function (d) {
                    return newY(d.Popularity_log)
                });
        }
    })
}