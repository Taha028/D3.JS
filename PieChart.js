<!DOCTYPE html>
<meta charset="utf-8">
<style>
  /* set the CSS */
  .slice text {
    font-size: 12pt;
    font-weight: bold;
    text-anchor: middle;
  }
</style>
<body>

<!-- load the d3.js library -->
<script src="https://d3js.org/d3.v4.min.js"></script>
<script>

// set the dimensions and margins of the graph
var width = 1500,
    height = 600,
    radius = Math.min(width, height) / 2;

// set the color scale
var color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

// create the pie
var pie = d3.pie()
    .value(function(d) { return d.count; })
    .sort(null);

// create the arc
var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

// add the SVG element
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// load the data
d3.csv("Funds Information.csv", function(error, data) {
  if (error) throw error;

  // count the occurrences of each RiskLevel value
  var counts = {};
  for (var i = 0; i < data.length; i++) {
    var riskLevel = data[i].RiskLevel;
    counts[riskLevel] = counts[riskLevel] ? counts[riskLevel] + 1 : 1;
  }

  // format the data
  var pieData = Object.keys(counts).map(function(key) {
    return { RiskLevel: key, count: counts[key] };
  });

  // generate the arcs
  var arcs = svg.selectAll(".arc")
      .data(pie(pieData))
    .enter().append("g")
      .attr("class", "arc");

  // draw the slices
  arcs.append("path")
      .attr("d", arc)
      .attr("fill", function(d) { return color(d.data.RiskLevel); })
    .append("title")
      .text(function(d) { return d.data.RiskLevel + ": " + (d.data.count/data.length*100).toFixed(2) + "%"; });

  // add the labels
  arcs.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.RiskLevel; })
      .attr("class", "slice");

});

</script>
</body>
