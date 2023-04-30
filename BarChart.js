<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>D3.js Bar Chart with Company Names on Top</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    /* Set the bar color */
    /* .bar {
      fill: steelblue;
    } */
    /* Set the font style and size for the company names */
    .text {
      font-family: sans-serif;
      font-size: 12px;
      fill: white;
    }
    /* Set the x axis label style */
    .axis--x text {
      font-family: sans-serif;
      font-size: 12px;
    }
    /* Set the y axis label style */
    .axis--y text {
      font-family: sans-serif;
      font-size: 12px;
    }
    .legend{
        display: flex;
        justify-content: center;
    }
    .legend-item{
        display: flex;
        align-items: center;
        margin-right: 12px;
        margin-left: 338px;
        font-family: sans-serif;
        font-size: 5px;
        font-weight:bold;
    }
    .legend-color {
        width: 20px;
        height: 20px;
        margin-right: 5px;
    }

    .tooltip {
        position: absolute;
        text-align: center;
        pointer-events: none;
        font-weight: bold;
        background: #fff;
        border: 1px solid #ddd;
        font-size: 12px;
        border-radius: 5px;
        font-family: sans-serif;
        background-color: white;
        padding: 5px;
        border: 1px solid black;
    }
  </style>
</head>
<body>
  <svg width="5000" height="500"></svg>
  <div class="legend"></div>
  <div class="tooltip"></div>

  <script>
    d3.csv("/LCompanies.csv").then(function(data) {

    // Extract the unique company names
    var companies = [...new Set(data.map(d => d.Sector))];

    // Create a data object for each company
    var companyData = companies.map(function(c) {
    return {
        name: c,
        count: data.filter(d => d.Sector === c).length
    };
    });

    // Set up the SVG element
    var svg = d3.select("svg");
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // var tooltip = d3.select("body")
    //     .append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);

    // Set up the scales
    var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .domain(companies);
    var y = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain([0, d3.max(companyData, d => d.count)]);

    // Add the bars
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    g.selectAll(".bar")
    .data(companyData)
    .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .style("fill", (d) => {
            d.color = color(d.name);
            return d.color;
        })
        .attr("title", d => d.name + ": " + d.count)
        .on("mouseover", function(d){
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.name + ": " + d.count)
            .style("left", (d3.event.offsetX + 10) + "px")
            .style("top", (d3.event.offsetY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    // Add the company names on top of each bar
    g.selectAll(".text")
    .data(companyData)
    .enter().append("text")
        .attr("class", "text")
        .attr("x", d => x(d.name) + x.bandwidth() / 2)
        .attr("y", d => y(d.count) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.name);

    // Add legend
    var legend = d3.select(".legend")
        .selectAll(".legend-item")
        .data(companyData)
        .enter().append("div")
        .attr("class", "legend-item");
    legend.append("div")
        .attr("class", "legend-color")
        .style("background-color", d => color(d.name));
    legend.append("div")
        .text(d => d.name);


    // Add the x axis
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the y axis
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10));

    })
  </script>
</body>
</html>
