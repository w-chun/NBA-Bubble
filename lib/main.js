import * as d3 from 'd3';

(function() {
  var width = 1000,
    height = 500;

    var svg = d3.select("#chart")
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .append("g")
      .attr("transform", "translate(0,0)");

      var defs = svg.append("defs");

      defs.append("pattern")
        .attr("id", "jordan-clarkson")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("weight", 1)
        .attr("preserveAspectRadio", "none")
        .attr("xmlns:xlink", "http://w3.org/1999/xlink")
        .attr("xlink:href", "../images/jc6.png");

    var radiusScale = d3.scaleSqrt().domain([6, 403]).range([10,60]);

    var forceXSeparate = d3.forceX(function(d) {
      if(d.fldGoalPct < .5) {
        return 200;
      } else {
        return 750;
      }
    }).strength(0.08);

    var forceXReset = d3.forceX(width / 2).strength(0.08);

    var forceY = d3.forceY(function(d) {
        return height / 2;
    }).strength(0.08);

    var forceCollide = d3.forceCollide(function(d) {
      return radiusScale(d.shotsMade) + 2;
    });

    var simulation = d3.forceSimulation()
      .force("x", forceXReset)
      .force("y", forceY)
      .force("collide", forceCollide);

    d3.queue()
      .defer(d3.csv, "../data/lakersFG_2016_2017.csv")
      .await(ready);

    function ready (error, datapoints) {

      const tooltip = d3.select("body").append("div")
        .style("visibility", "hidden")
        .style("position", "absolute")
        .style("background-color", "rgba(0,0,0,0.7)")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("font", "14px sans-serif")
        .style("color", "white");

        var circles = svg.selectAll(".player")
          .data(datapoints)
          .enter().append("circle")
          .attr("class", "player")
          .attr("id", function(d) {
            return `${d.player.replace(/ /g,"-")}`;
          })
          .attr("r", function(d) {
            return radiusScale(d.shotsMade);
          })
          .attr("fill", function(d) {
            return "url(#" + d.player.replace(/ /g,"-") + ")";
          })
          .on("mouseover", function(d) {
            tooltip.html(
              `${d.player}<br/>
              Shots Made: ${d.shotsMade}</br>
              FG%: ${d.fldGoalPct}<br/>`
            );
            tooltip.style("visibility", "visible");
          })
          .on("mousemove", function() {
             return tooltip
               .style("top", (d3.event.pageY - 15) + "px")
               .style("left",(d3.event.pageX + 10) + "px");
           })
          .on("mouseout", () => tooltip.style("visibility", "hidden"))
          .on("click", (d,i) => {
              simulation
              .force("x", d3.forceX(function (e) {
                if (e.idx == i ) {
                  return 750;
                } else {
                  return 200;
                }
              }))
              .force("y", d3.forceY(function (e) {
                if (e.idx == i) {
                  return height/4;
                } else {
                  return height/2;
                }
              }))
              .alphaTarget(0.5)
              .restart();
          });

        defs.selectAll(".player-pattern")
          .data(datapoints)
          .enter().append("pattern")
          .attr("class", "player-pattern")
          .attr("id", function(d){
            return d.player.replace(/ /g,"-");
          })
          .attr("height", "100%")
          .attr("width", "100%")
          .attr("patternContentUnits", "objectBoundingBox")
          .append("image")
          .attr("height", 1)
          .attr("weight", 1)
          .attr("preserveAspectRadio", "none")
          .attr("xmlns:xlink", "http://w3.org/1999/xlink")
          .attr("xlink:href", function (d) {
            return d.imagePath;
          });

        d3.select("#percent").on('click', function() {
          simulation
            .force("x", forceXSeparate)
            .alphaTarget(0.5)
            .restart();
        });

        d3.select("#reset").on('click', function() {
          simulation
            .force("x", forceXReset)
            .alphaTarget(0.5)
            .restart();
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

//
// d3.csv("../data/lakers_2016_2017.csv", function(data){
//   console.log(data);
//   var shots = d3.select('svg')
//       .selectAll('g')
//       .data(data)
//       .enter()
//       .append('g')
//         .attr('class', 'shot')
//         .attr('transform', function(d) {
//           return "translate(" + d.y * 5 + "," + d.x * 5 + ")";
//         })
//       .on('mouseover', function(d) {
//           d3.select(this).raise()
//             .append('text')
//             .attr('class', 'playerName')
//             .text(d.name);
//       })
//       .on('mouseout', function(d) {
//           d3.selectAll('text.playerName').remove();
//       });
//
//     shots.append("circle")
//       .attr('r', 5)
//       .attr('fill', function(d) {
//         if (d.shot_made_flag == 1) {
//           return 'purple';
//         } else {
//           return 'yellow';
//         }
//       });
//   });
//
// var players = d3.nest()
//   .key(function(d) {
//     return d.player;
//   })
//   .rollup(function(a) {
//     return a.length;
//   })
//   .entries(datapoints);
//
// var selector = d3.select("#selector");
//
// selector
//   .selectAll("option")
//   .datapoints(players)
//   .enter()
//   .append("option")
//     .text(function(d) {
//       return d.key + ":" + d.value;
//     })
//     .attr("value", function(d) {
//       return d.key;
//     });
