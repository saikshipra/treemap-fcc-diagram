const w = 960;
const h = 570;

const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");

d3.json("data.json").then(data => {
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

  d3.treemap()
    .size([w, h])
    .padding(1)
    (root);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const tile = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  tile.append("rect")
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => color(d.data.category))
    .on("mouseover", function(event, d) {
      tooltip
        .style("visibility", "visible")
        .html(`${d.data.name}<br>${d.data.category}<br>${d.data.value}`)
        .attr("data-value", d.data.value)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + "px");
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));

  tile.append("text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append("tspan")
    .text(d => d)
    .attr("x", 4)
    .attr("y", (d, i) => 13 + i * 10);

  // Legend
  const categories = root.leaves().map(n => n.data.category).filter((v, i, s) => s.indexOf(v) === i);
  const legend = d3.select("#legend").attr("width", 400).attr("height", 100);

  const legendItem = d3.select("#legend")
    .selectAll(".legend-item")
    .data(categories)
    .enter().append("div")
    .attr("class", "legend-item")
    .style("display", "inline-block")
    .style("margin-right", "10px");

  legendItem.append("div")
    .style("width", "20px")
    .style("height", "20px")
    .style("background-color", d => color(d))
    .style("display", "inline-block")
    .style("margin-right", "5px");

  legendItem.append("span").text(d => d);
});
