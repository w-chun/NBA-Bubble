import * as d3 from 'd3';


(function() {
  var width = 500,
    height = 500;

    var svg = d3.select("#chart")
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .append("g")
      .attr("transform", "translate(0,0)");

    var radiusScale = d3.scaleSqrt().domain([6, 403]).range([10,50]);

    var simulation = d3.forceSimulation()
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force("collide", d3.forceCollide(function(d) {
        return radiusScale(d.shotsMade) + 1;
      }));

    d3.queue()
      .defer(d3.csv, "../data/lakersFG_2016_2017.csv")
      .await(ready);

    function ready (error, datapoints) {

        var circles = svg.selectAll(".player")
          .data(datapoints)
          .enter().append("circle")
          .attr("class", "player")
          .attr("r", function(d) {
            return radiusScale(d.shotsMade);
          })
          .attr("fill", "purple")
          .on('click', function(d) {
            console.log(d);
          });

        simulation.nodes(datapoints)
          .on('tick', ticked);

        function ticked() {
          circles
            .attr("cx", function(d) {
              return d.x;
            })
            .attr("cy", function(d) {
              return d.y;
            });
        }
      }
  })();
