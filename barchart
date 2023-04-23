var dataset = [60,100,56,120,180,30,40,120,160];

var svgWidth=500, svgHeight=300,barPadding=5;
var barwidth = (svgWidth/dataset.length);

var svg = d3.select("svg")
    .attr("width",svgWidth)
    .attr("height",svgHeight);
    
var barChart = svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("y",function(d){
        return svgHeight - d
    })
    .attr("height",function(d){
        return d
    })
    .attr("width",barwidth - barPadding)
    .attr("transform",function(d,i){
        var translate = [barwidth * i ,0]
        return "translate("+translate+")";
    });

var pieWidth = 200;
var pieHeight = 200;
var color = d3.scaleOrdinal(d3.schemeCategory10);
var pieRadius = Math.min(pieWidth, pieHeight) / 2;

var pieSvg = d3.select("#pie-chart")
    .append("svg")
    .attr("width", pieWidth)
    .attr("height", pieHeight);

var pie = d3.pie();

var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(pieHeight / 2);

var pieChart = pieSvg.selectAll("path")
    .data(pie(dataset))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", function(d, i) {
        return color(i);
    });
