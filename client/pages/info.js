var templates = require('../templates');
var View = require('ampersand-view');
var EarthCycles= require('natural_calendar');


module.exports = View.extend({
    pageTitle: 'more info',
    // template: templates.pages.info,
    template: "<div><canvas id='cycles' width='500px;' height='500px'></canvas>   <input id='date-pick' type='date' name='show-date'> </div> ",

    events: {
        "input #date-pick": "dateFromGregorian"
    },

    params: {
      center: {x:250, y:250},
      radius: 100,
      moonRadius:20
    },

    initialize: function(){
      now = new Date()
      this.earthCycles = new EarthCycles(now);
      this.moonths = this.earthCycles.moonths;
      this.dayOfMoonth = this.earthCycles.dayOfMoonth();
      this.dayOfYear = this.earthCycles.dayOfYear();
      this.daysInYear = this.earthCycles.daysInYear();
      this.moonthOfYear = this.earthCycles.moonthOfYear();
      this.moonthsInYear = this.moonths.length;
    },

    

    dateFromGregorian: function(ev) {
      var date = new Date(ev.delegateTarget.value);
      console.log('date', date);
      this.earthCycles = new EarthCycles(date);
      this.render();
    },

    render: function () {
        this.renderWithTemplate();
        this.findCanvas();
        this.drawYearCircle();
        this.drawMoonthLines();
        this.drawEarth();
        this.drawMoonCircle();
        this.drawMoon();
    },

    findCanvas: function(){      
      this.canvas = $(this.el).find('#cycles')[0];
    },

    polarToCartesian: function(angle, length, center){
      if (center == undefined) {
        center = {x:this.params.center.x, y:this.params.center.y}
      }
      x = center.x + (length * Math.cos(angle));
      y = center.y + (length * Math.sin(angle));
      return ({x:x, y:y});
    },

    drawYearCircle: function(){
      context = this.canvas.getContext("2d");
      context.beginPath();
      context.arc(this.params.center.x,this.params.center.y,this.params.radius,0, 2*Math.PI);
      context.stroke();
    },

    fractionOfYear: function(){
      fractionOfYear = this.dayOfYear/this.daysInYear;
      return fractionOfYear;
    },

    getEarthPosition: function(){
      fractionOfYear = this.fractionOfYear();
      angle = (Math.PI*2) * fractionOfYear;
      earthPoint = this.polarToCartesian(angle,this.params.radius);
      return earthPoint
    },

    getMoonPosition: function(){
      earthPoint = this.getEarthPosition();
      fractionOfYear = this.fractionOfYear();
      startAngle = ((Math.PI*2) * fractionOfYear) - Math.PI;
      fractionOfMoonth = this.dayOfMoonth/this.daysInMoonth;
      moonthAngle = (Math.PI*2) * fractionOfMoonth;
      moonPoint = this.polarToCartesian(startAngle + moonthAngle, this.params.moonRadius, earthPoint);
      return moonPoint;
    },

    drawMoonCircle: function(){
      context = this.canvas.getContext("2d");
      context.beginPath();
      earthPoint = this.getEarthPosition();
      context.arc(earthPoint.x,earthPoint.y, this.params.moonRadius,0, 2*Math.PI);
      context.stroke();
    },

    drawMoon: function(){
      context = this.canvas.getContext("2d");
      context.beginPath();
      moonPoint = this.getMoonPosition();
      context.arc(moonPoint.x,moonPoint.y, 2,0, 2*Math.PI);
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
      moonths = this.moonths
      daysInYear = this.daysInYear
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
