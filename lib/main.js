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
    }).strength(0.05);

    var forceXCombine = d3.forceX(width / 2).strength(0.05);

    var forceY = d3.forceY(function(d) {
        return height / 2;
    }).strength(0.05);

    var forceCollide = d3.forceCollide(function(d) {
      return radiusScale(d.shotsMade) + 1;
    });

    var simulation = d3.forceSimulation()
      .force("x", forceXCombine)
      .force("y", forceY)
      .force("collide", forceCollide);

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
          .attr("fill", function(d) {
            return "url(#" + d.player.replace(/ /g,"-") + ")";
          })
          .on('click', function(d) {
            console.log(d);
          })
          .on('mouseover', function(d) {
               d3.select(this).raise()
                 .append('text')
                 .attr('class', 'playerName')
                 .text(d.player);
           })
           .on('mouseout', function(d) {
               d3.selectAll('text.playerName').remove();
           });

        defs.selectAll(".artist-pattern")
          .data(datapoints)
          .enter().append("pattern")
          .attr("class", "artist-pattern")
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

        d3.select("#combine").on('click', function() {
          simulation
            .force("x", forceXCombine)
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
