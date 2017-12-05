import * as d3 from 'd3';

d3.csv("../data/lakers_2016_2017.csv", function(data){
  console.log(data);
  var shots = d3.select('svg')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
        .attr('class', 'shot')
        .attr('transform', function(d) {
          return "translate(" + d.converted_x * 10 + "," + d.converted_y * 10 + ")";
        });

    shots.append("circle")
      .attr('r', 5);
  });
