var width = $(window).width()/2.0,
    height = $(window).height()/2.0;

var tree = d3.layout.tree()
    .size([height, width - 230]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select(".taxonomy").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(40,0)");

d3.json("data/taxonomy/taxonomy.json", function(error, json) {
  if (error) throw error;

  var nodes = tree.nodes(json),
      links = tree.links(nodes);

  var link = svg.selectAll("path.link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  var node = svg.selectAll("g.node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("circle")
      .attr("r", 4.5)
      .on("mouseover", function(){console.log(d3.select(this)[0][0].__data__.parent.name)})//d3.select(this).style("fill", "lightblue");})
      .on("mouseout", function(){d3.select(this).style("fill", "#fff")});

  node.append("text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 3)
      .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) {
        if ( !d.count ) return d.name;
        else return d.name +' ['+d.count+']';
        });

});

function resize() {
  width = window.innerWidth, height = window.innerHeight;
  svg.attr("width", width).attr("height", height);
  force.size([width, height]).resume();
}