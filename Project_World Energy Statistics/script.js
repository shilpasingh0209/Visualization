$(document).ready(function() {
  var w = 990; 
  var h = 490;  
  var proj = d3.geo.equirectangular();
  var path = d3.geo.path()
    .projection(proj);

 var svg = d3.select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

  svg.append('rect')
    .attr('width', w)
    .attr('height', h)
    .attr('fill', '#F1DF2B');
var g = svg.append("g");

//scaling for zoom
var x0 = d3.scale.linear()
      .domain([-w / 2, w / 2])
      .range([0, w]),
    x = x0.copy();

    var y = d3.scale.linear()
    .domain([-h / 2, h / 2])
    .range([h, 0]);
  
//Calling the json file for world map
  d3.json('https://d3js.org/world-50m.v1.json', function(error, data) {
    if (error) console.error(error);
    g.append('path')
      .datum(topojson.feature(data, data.objects.countries))
      .attr('d', path);
    
  //Zoom effect
    var zoom = d3.behavior.zoom()
        .scaleExtent([1,10])
        .x(x)
        .y(y)
      .on("zoom", function() {
        g.attr("transform", "translate(" +
          d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
        g.selectAll("path")
          .attr("d", path.projection(proj));
      });
    svg.call(zoom);

  //Fetching the energy data along with latittude and longitude coordiantes
    d3.json('https://gist.githubusercontent.com/shilpa0209/9571857159e035f6df9c91ffc95d0670/raw/f806bacdb1ac5f1eda74dc39f91479bcc1947e37/data.json', function(error, data) {
      if (error) 
        console.error(error);
      
      var locations = data.features; //putting features from json in the variable
      var hue = 0; //creating th dots
      
      //pass data from the json as an argument

      locations.map(function(d) { 
       hue += 0.50                // color for the dots
 //       d.color = 'hsl(' + hue + ', 100%, 50%)';
        d.color = 'black';
      });
      
      //binding svg with the features of json
      g.selectAll('circle')
        .data(locations)
        .enter()
        .append('circle') //show the dots
        .attr('cx', function(d) {
          if (d.geometry) {
            return proj([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0]; //fetching the coorinates from json
          }
        })
        .attr('cy', function(d) {
          if (d.geometry) {
            return proj([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
          }
        })
        .attr('r','3') 
        .style('fill', function(d) {
          return d.color; 
        })
      
      //Fetching the features from json mouseover and putting it in the tooltip div created in the html
        .on('mouseover', function(d) {
          d3.select(this)
            .style('fill', 'white'); 
          d3.select('#name')
            .text(d.properties.name);
          d3.select('#EnergyProduced')
            .text(d.properties.EnergyProduced);
          d3.select('#EnergyConsumed')
            .text(d.properties.EnergyConsumed);
          d3.select('#OilConsumed')
            .text(d.properties.OilConsumed);
          d3.select('#NaturalGasProduction')
            .text(d.properties.NaturalGasProduction);
          d3.select('#CoalConsumption')
            .text(d.properties.CoalConsumption);
          d3.select('#HydroElectricProduction')
            .text(d.properties.HydroElectricProduction);
          d3.select('#year')
            .text(d.properties.year);
          d3.select('#tooltip')
            .style('left', (d3.event.pageX + 20) + 'px')
            .style('top', (d3.event.pageY - 80) + 'px')
            .style('display', 'block')
            .style('opacity', 0.85)
        })
        //to remove the block on mouse out and fill the dot with original color
        .on('mouseout', function(d) { 
          d3.select(this).style('fill', d.color);
          d3.select('#tooltip')
            .style('display', 'none');
        });    
      });
  });
});