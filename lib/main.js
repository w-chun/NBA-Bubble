import * as d3 from 'd3';

(function() {
  var width = window.screen.width,
    height = window.screen.height;

    var svg = d3.select("#bubble")
      .append("svg")
      .attr("class", "svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .classed("svg-content", true)
      .append("g")
      .attr("transform", "translate(0,0)");

    var defs = svg.append("defs");

    var radiusScale = d3.scaleSqrt().domain([6, 2729]).range([30,70]);

    var forceXSeparate = d3.forceX(function(d) {
      if (d.fldGoalPct > .5) {
        return (width * .85);
      } else if (d.fldGoalPct < .5 && d.fldGoalPct > .35) {
        return (width * .45);
      // } else if (d.fldGoalPct < .4 && d.fldGoalPct > .3) {
      //   return (width * .3);
      } else {
        return (width * .15);
      }
    }).strength(.12);

    var forceXReset = d3.forceX(window.screen.width / 2).strength(.12);

    var forceY = d3.forceY(function(d) {
        return (window.screen.height / 2.5);
    }).strength(.12);

    var forceCollide = d3.forceCollide(function(d) {
      return radiusScale(d.shotsMade) + 8;
    });

    var simulation = d3.forceSimulation()
      .force("x", forceXReset)
      .force("y", forceY)
      .force("collide", forceCollide);

    var queue = d3.queue()
      .defer(d3.csv, "https://w-chun.github.io/NBA-Bubble/data/NBAFG_2016_2017.csv")
      .await(ready);

    function ready (error, datapoints) {

      var players = d3.nest()
      .key(function(d) {
        return d.player;
      })
      .rollup(function(a) {
        return a.length;
      })
      .entries(datapoints);

      var season = d3.select("#year");

      var years = d3.nest()
        .key(function() {
          return "Year";
        })
        .rollup(function () {
          return "2016-2017";
        })
        .entries(datapoints);

      season
        .selectAll("option")
        .data(years)
        .enter()
        .append("option")
        .text(function(d) {
          return d.key + " : " + d.value;
        });

      var team = d3.select("#team");

      var teams = d3.nest()
        .key(function(d) {
          return d.team;
        })
        .rollup(function (arr) {
          return arr.length;
        })
        .entries(datapoints);

        teams.unshift({'key': 'All Teams',
          'value': 30
        });

      team
        .selectAll("option")
        .data(teams)
        .enter()
        .append("option")
        .text(function(d) {
          return d.key;
        })
        .attr('value', function(d) { return d.key; });


      team
        .on('change', function() {
          d3.selectAll(".player")
          .attr('visibility', 'visible');
        var value = team.property('value');
          if (value != "All Teams") {
            d3.selectAll('.player')
              .filter(function(d) { return d.team != value; })
              .attr('visibility', 'hidden');
          }
      });

      const tooltip = d3.select("body").append("div")
        .style("visibility", "hidden")
        .style("position", "absolute")
        .style("background-color", "rgba(0,0,0,0.7)")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("font", "14px sans-serif")
        .style("color", "white");

      const playerInfo = d3.select("#bubble").append("div")
        .style("visibility", "hidden")
        .style("position", "absolute")
        .style("background-color", "rgba(29, 66, 138, 0.7)")
        .style("padding", "10px 20px")
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
              playerInfo.html(
                `<h3>${d.player}</h3><br/><br/>
                Shots Made: ${d.shotsMade}<br/><br/>
                FG%: ${d.fldGoalPct}<br/><br/>
                3pt Made: ${d.threesMade}</br><br/>
                3pt Attempts: ${d.threesTaken}</br><br/>
                3pt%: ${d.threesPct}</br><br/>
                Total Shots: ${d.totalShots}</br><br/>`
              )
                .style("top", "30%")
                .style("right", "22%")
                .style("visibility", "visible");
              simulation
              .force("x", d3.forceX(function (e) {
                if (e.idx == i ) {
                  return width * .72;
                } else {
                  return width * .25;
                }
              }).strength(.12))
              .force("y", d3.forceY(function (e) {
                if (e.idx == i) {
                  return height/4;
                } else {
                  return height/2;
                }
              }).strength(.12))
              .alphaTarget(.16)
              .restart();
              percentages
                .style("visibility", "hidden");
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

        const percentages = d3.select("body").append("div")
          .attr("class", "percentages")
          .style("visibility", "hidden")
          .style("position", "absolute")
          .style("padding", "10px")
          .style("border-radius", "5px")
          .style("font", "18px 'Oswald', sans-serif")
          .style("color", "#fdb927")
          .style("width", "95%");


        d3.select("#percent").on('click', function() {
          simulation
            .force("x", forceXSeparate)
            .force("y", forceY)
            .alphaTarget(.16)
            .restart();
          playerInfo
            .style("visibility", "hidden");
          percentages.html(
            `<div>Under 35%</div>
            <div>35% - 50%</div>
            <div>Greater than 50%</div>`
          )
            .style("visibility", "visible")
            .style("top", "220px");
        });

        d3.select("#reset").on('click', function() {
          simulation
            .force("x", forceXReset)
            .force("y", forceY)
            .alphaTarget(.16)
            .restart();
          playerInfo
            .style("visibility", "hidden");
          percentages
            .style("visibility", "hidden");
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


// var shotChart = d3.csv("../data/lakers_2016_2017.csv", function(data) {
//   var xScale = d3.scaleLinear()
//     .domain([-200, 250])
//     .range([100, 750]);
//
//   var yScale = d3.Linear()
//     .domain([-50, 750])
//     .range([100, 1150]);
//
//   var shots = d3.select('#canvas')
//       .selectAll('g')
//       .data(data)
//       .enter()
//       .append('g')
//         .attr('class', 'shot')
//         .attr('transform', function(d) {
//           return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
//         })
//       // .on('mouseover', function(d) {
//       //     d3.select(this).raise()
//       //       .append('text')
//       //       .attr('class', 'playerName')
//       //       .text(d.name);
//       // })
//       // .on('mouseout', function(d) {
//       //     d3.selectAll('text.playerName').remove();
//       // });
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
//
//       var players = d3.nest()
//       .key(function(d) {
//         return d.name;
//       })
//       .rollup(function(a) {
//         return a.length;
//       })
//       .entries(data);
//
//       players.unshift({"key": "Lakers",
//         "value": d3.sum(players, function(d) {
//           return d.value;
//         })
//       });
//
//       var selector = d3.select("#selector");
//
//       selector
//         .selectAll("option")
//         .data(players)
//         .enter()
//         .append("option")
//         .text(function(d) {
//           return d.key + " : " + d.value;
//         })
//         .attr("value", function(d) {
//           return d.key;
//       });
//
//       selector
//         .on("change", function () {
//           d3.selectAll(".shot")
//             .attr("opacity", 1.0);
//           var value = selector.property("value");
//             if (value != "Lakers") {
//               d3.selectAll(".shot")
//                 .filter(function (d) {
//                   return d.name !== value;
//                 })
//                 .attr("opacity", 0);
//             }
//         });
//   });
