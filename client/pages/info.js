var templates = require('../templates');
var View = require('ampersand-view');
// var EarthCycles = require('../earth_cycles');


module.exports = View.extend({
    pageTitle: 'more info',
    template: "<div><canvas id='cycles' width='500px;' height='500px' style='border:1px solid #000000;'></canvas></div>",
    
    params: {
      center: {x:250, y:250},
      radius: 100
    },

    render: function () {
        this.renderWithTemplate();
        this.findCanvas();
        this.drawYearCircle();
        this.drawMoonthLines();
        this.drawEarth();
        this.drawMoonCircle();
    },

    findCanvas: function(){
      this.canvas = $(this.el).find('#cycles')[0];
    },

    polarToCartesian: function(angle, length){
      x = this.params.center.x + (length * Math.cos(angle));
      y = this.params.center.y + (length * Math.sin(angle));
      return ({x:x, y:y});
    },

    drawYearCircle: function(){
      context = this.canvas.getContext("2d");
      context.beginPath();
      context.arc(this.params.center.x,this.params.center.y,this.params.radius,0, 2*Math.PI);
      context.stroke();
    },

    getEarthPosition: function(){
      daysInYear = this.model.earthCycles.daysInYear();
      dayOfYear = this.model.earthCycles.dayOfYear();
      fractionOfYear = dayOfYear/daysInYear;
      angle = (Math.PI*2) * fractionOfYear;
      earthPoint = this.polarToCartesian(angle,this.params.radius);
      return earthPoint
    },

    drawMoonCircle: function(){
      context = this.canvas.getContext("2d");
      context.beginPath();
      earthPoint = this.getEarthPosition();
      context.arc(earthPoint.x,earthPoint.y, (this.params.radius)/3,0, 2*Math.PI);
      context.stroke();
    },

    drawEarth: function(){
      context = this.canvas.getContext("2d");
      context.beginPath();
      earthPoint = this.getEarthPosition();
      context.arc(earthPoint.x,earthPoint.y, 5,0, 2*Math.PI);
      context.stroke();
    },

    drawMoonthLines: function(){
      context = this.canvas.getContext("2d");
      context.beginPath();
      moonths = this.model.earthCycles.moonths
      daysInYear = this.model.earthCycles.daysInYear()
      cumulativeDays = 0
      for (i=0;i<moonths.length;i++) {
        moonthLength = moonths[i];
        cumulativeDays = cumulativeDays + moonthLength;
        fractionOfYear = cumulativeDays/daysInYear;
        angle = (Math.PI*2) * fractionOfYear;
        context.beginPath();     
        context.moveTo(this.params.center.x, this.params.center.y);
        toPoint = this.polarToCartesian(angle,this.params.radius);
        context.lineTo(toPoint.x, toPoint.y);
        context.stroke();
      }
      
    }
});
