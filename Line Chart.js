// The code Contains line chart on Open And Close of stock market price of companies and also it have tooltip when you place mouse on line chart it shows value


<!DOCTYPE html>
<meta charset="utf-8">
<style>
  /* set the CSS */
  .line {
    fill: none;
    stroke: steelblue;
    stroke-width: 2px;
  }
  .tooltip {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    font-size: 12px;
    padding: 10px;
    position: absolute;
    text-align: center;
    visibility: hidden;
    z-index: 10;
  }
</style>
<body>
<div class="tooltip"></div>


<!-- load the d3.js library -->    	
<script src="https://d3js.org/d3.v4.min.js"></script>
<script>

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("position", "absolute")
  .style("z-index","10");

// Get the data
d3.csv("combined_data2.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.Date);
      d.close = +d.Close;
  });

  // filter the data for the specified date range
  
  data = data.filter(function(d) {
      return d.Symbol === "OGDC" && d.date >= parseTime("01-Jan-2013") && d.date < parseTime("17-Jan-2023");
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);


  svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline)
    .on("mousemove", function() {
        var mouseX = d3.mouse(this)[0];
        var date = x.invert(mouseX);
        var i = d3.bisector(function(d) { return d.date; }).left(data, date, 1);
        var d0 = data[i - 1];
        var d1 = data[i];
        var d = date - d0.date > d1.date - date ? d1 : d0;
        tooltip.style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 10) + "px")
            .style("visibility", "visible")
            .text("Close price: " + d.Close);
    })
    .on("mouseleave", function() {
        // Hide the tooltip when the mouse leaves the chart
        tooltip.style("visibility", "hidden");
    });



  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
  svg.selectAll(".line")
  .on("mousemove", function() {
      var mouseX = d3.mouse(this)[0];
      var date = x.invert(mouseX);
      var i = d3.bisector(function(d) { return d.date; }).left(data, date, 1);
      var d0 = data[i - 1];
      var d1 = data[i];
      var d = date - d0.date > d1.date - date ? d1 : d0;
      tooltip.style("left", (d3.event.pageX + 10) + "px")
          .style("top", (d3.event.pageY - 10) + "px")
          .style("visibility", "visible")
          .text("Close price: " + d.Close);
  })
  .on("mouseleave", function() {
      // Hide the tooltip when the mouse leaves the chart
      tooltip.style("visibility", "hidden");
  });    
  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill","#000")
      .attr("transform","rotate(-90)")
      .attr("y",6)
      .attr("dy","0.7em")
      .attr("text-anchor","end")
      .text("Price ($)");

});

</script>
</body>
