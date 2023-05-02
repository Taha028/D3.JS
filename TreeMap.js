<!DOCTYPE html>
<html>
<head>
    <title>Tree Map Example</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        rect {
            stroke: white;
        }
        label {
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <h1>Tree Map Example</h1>
    <label for="year-select">Select Year:</label>
    <select id="year-select">
        <option value="2013">2013</option>
        <option value="2014">2014</option>
        <option value="2015">2015</option>
        <option value="2016">2016</option>
        <option value="2017">2017</option>
        <option value="2018">2018</option>
        <option value="2019">2019</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
    </select>
    <label for="symbol-select">Select Symbol:</label>
    <select id="symbol-select">
        <option value="AGTL">AGTL</option>
    </select>
    <div id="chart"></div>
    <script>
        d3.csv("combined_data.csv").then(function(data){
            data.forEach(function(d){
                d.Volume = +d.Volume;
                d.Open = +d.Open;
                d.Close = +d.Close;
            });
            var yearFilter = "2013";
            var filteredData = data.filter(function(d){
                return d.Date.startsWith(yearFilter);
            });
            var treemap = d3.treemap()
                .size([600,400])
                .paddingInner(2);
            
            // Set up hierarchy
            var root = d3.hierarchy({values: filteredData}, function(d) { return d.values; })
                .sum(function(d) { return d.Volume; })
                .sort(function(a, b) { return b.value - a.value; });
            
            // Create color scale
            var color = d3.scaleOrdinal(d3.schemeCategory10);
            treemap(root);

            var svg = d3.select("#chart")
                .append("svg")
                .attr("width", 600)
                .attr("height", 400);
            
            var nodes = svg.selectAll("rect")
                .data(root.leaves())
                .enter()
                .append("rect")
                .attr("x", function(d) { return d.x0; })
                .attr("y", function(d) { return d.y0; })
                .attr("width", function(d) { return d.x1 - d.x0; })
                .attr("height", function(d) { return d.y1 - d.y0; })
                .attr("fill", function(d) { return color(d.parent.data.Symbol); });

            var labels = svg.selectAll("text")
                .data(root.leaves())
                .enter()
                .append("text")
                .attr("x", function(d) { return d.x0 + 5; })
                .attr("y", function(d) { return d.y0 + 15; })
                .text(function(d) { return d.data.Symbol; })
                .attr("font-size", "12px")
                .attr("fill", "white");
            
            d3.select("#year-select").on("change", function() {
            yearFilter = this.value;
            filteredData = data.filter(function(d) {
                return d.Date.startsWith(yearFilter);
            });
            root = d3.hierarchy({values: filteredData}, function(d) {
                return d.values;
            })
            .sum(function(d) { return d.Volume; })
            .sort(function(a, b) { return b.value - a.value; });

            treemap(root);

            nodes.data(root.leaves())
                .transition()
                .duration(1000)
                .attr("x", function(d) { return d.x0; })
                .attr("y", function(d) { return d.y0; })
                .attr("width", function(d) { return d.x1 - d.x0; })
                .attr("height", function(d) { return d.y1 - d.y0; })
                .attr("fill", function(d) { return color(d.parent.data.Symbol); });

            labels.data(root.leaves())
                .transition()
                .duration(1000)
                .attr("x", function(d) { return d.x0 + 5; })
                .attr("y", function(d) { return d.y0 + 15; })
                .text(function(d) { return d.data.Symbol; });
        });

