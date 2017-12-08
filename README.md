# NBA Bubble

[NBA Bubble](https://w-chun.github.io/NBA-Bubble/) is an interactive visualization to view your team's stats and see how each player did during the season.

## Table of Contents

- [Technology](#technology)
- [Features](#features)
- [Maintainers](#maintainers)
- [License](#license)

## Technology

NBA Bubble is developed using Vanilla JavaScript with the addition of D3.js, which creates the player bubble visualizations. HMTL was used to create SVG and to formulate the environment supporting interactivity and animations.  

## Features

### Home

The player bubbles were created and scaled by the number of shots the player made for the whole season. Each bubble then displays the player's name when hovered over by the user.  

![Home](https://github.com/w-chun/NBA-Bubble/blob/master/images/home.png)

```javascript

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
```

### Player Info

![Player Info](https://github.com/w-chun/NBA-Bubble/blob/master/images/playerinfo.png)

When a user clicks on a player, the player is separated from the rest of the team and additional player stats are popped up.


### Filter

![Filter](https://github.com/w-chun/NBA-Bubble/blob/master/images/filter.png)

When the user clicks filter by FG%, the players are sorted to their perspective group for their shooting percentage throughout the year.

### Future Directions

- [ ] Add more NBA teams
- [ ] Add additional season stats


## Maintainers

[@w-chun](https://github.com/w-chun)


## License

ISC © 2017 Wilson
