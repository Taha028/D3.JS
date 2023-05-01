<!DOCTYPE html>
<html>
<head>
    <title>Bar and Pie Charts</title>
    <script src="https://d3js.org/d3.v4.min.js"></script>
</head>
<body>
    <h1>Bar Chart</h1>
    <div id="bar-chart"></div>
    <h1>Pie Chart</h1>
    <div id="pie-chart"></div>
    <script>
        var dataset = [60,100,56,120,180,30,40,120,160];
        var svgWidth = 500;
        var svgHeight = 300;
        var barPadding = 5;
        var barwidth = (svgWidth/dataset.length);

        // Create SVG for bar chart
        var svg = d3.select("#bar-chart")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
            
        var barChart = svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("y", function(d) {
                return svgHeight - d;
            })
            .attr("height", function(d) {
                return d;
            })
            .attr("width", barwidth - barPadding)
            .attr("transform", function(d, i) {
                var translate = [barwidth * i ,0];
                return "translate(" + translate + ")";
            });

        // Create SVG for pie chart
        var pieData = [60, 100, 56, 120, 180, 30, 40, 120, 160];
        var labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

        var pieWidth = 500;
        var pieHeight = 300;
        var pieRadius = Math.min(pieWidth, pieHeight) / 2;

        var pieSvg = d3.select("#pie-chart")
            .append("svg")
            .attr("width", pieWidth)
            .attr("height", pieHeight);

        var pieG = pieSvg.append("g")
            .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d; });

        var path = d3.arc()
            .outerRadius(pieRadius - 10)
            .innerRadius(0);

        var label = d3.arc()
            .outerRadius(pieRadius - 40)
            .innerRadius(pieRadius - 40);

        var pieArc = pieG.selectAll(".arc")
            .data(pie(pieData))
            .enter()
            .append("g")
            .attr("class", "arc");

        pieArc.append("path")
            .attr("d", path)
            .attr("fill", function(d) { return color(d.data); });

        pieArc.append("text")
            .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
            .attr("dy", "0.35em")
            .text(function(d) { return labels[d.index]; });
    </script>
</body>
</html>
