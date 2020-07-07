var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//load in data from CSV
d3.csv("assets/data/data.csv").then(function(myData) {
    console.log(myData);
    // Parse data and cast as numbers
    myData.forEach(function(data){
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
});
// Step 2: Create scale functions
var xLinearScale = d3.scaleLinear()
  .domain([d3.min(myData, d => d.poverty)-1, d3.max(myData, d => d.poverty)+1])
  .range([0, width]);
var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(myData, d => d.obesity)+5])
  .range([height, 0]);

// Step 3: Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Step 4: Append Axes to the chart
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);
chartGroup.append("g")
  .call(leftAxis);    

// Step 5a: Create Circles
var circlesGroup = chartGroup.selectAll("circle")
  .data(myData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.obesity))
  .attr("r", "10")
  .attr("fill", "blue")
  .attr("opacity", ".7");

// Step 5b: Create Circle Labels
var circleLabels = chartGroup.selectAll(null).data(myData).enter().append("text");
circleLabels
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.obesity))
  .text(d => d.abbr)
  .attr("font-family", "sans-serif")
  .attr("font-size", "9px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");

// Step 6: Initialize tool tip
var toolTip = d3
.tip()
.attr("class", "toolTip")
.offset([80,-60])
.html(function(d){
    return (`${d.abbr}<br>% Obese: ${d.obese}<br>% Poverty: ${d.poverty}`);
});

// Step 7: Create tooltip in the chart
chartGroup.call(toolTip);

// Step 8: Create event listeners to display and hide the tooltip
circlesGroup.on("click", function(data) {
  toolTip.show(data, this);
})

// onmouseout event
.on("mouseout", function(data, index) {
  toolTip.hide(data);
});

// Create axes labels
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 1.25))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Percentage of Population that is Obsese (%)");
chartGroup.append("text")
  .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("Percentage of Population in Poverty (%)");
}).catch(function(error) {
  console.log(error);
});