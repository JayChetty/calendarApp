var templates = require('../templates');
var View = require('ampersand-view');
var EarthCycles= require('natural_calendar');


module.exports = View.extend({
    pageTitle: 'more info',
    template: templates.pages.info,
    // template: "<div><canvas id='cycles' width='500px;' height='500px'></canvas>   <input id='date-pick' type='date' name='show-date'> </div> ",

    events: {
        "input #date-pick": "dateFromGregorian",
        "click #moonth-grid a": "setDayFromGrid",
        "click #moonth-row a": "setMoonthFromRow"
    },

    params: {
      center: {x:250, y:250},
      radius: 100,
      moonRadius:20
    },

    initialize: function(){
      var now = new Date();
      this.earthCycles = new EarthCycles(now);
      this.moonths = this.earthCycles.moonths;
      this.dayOfMoonth = this.earthCycles.dayOfMoonth();
      this.daysInMoonth = this.earthCycles.daysInMoonth();
      this.dayOfYear = this.earthCycles.dayOfYear();
      this.daysInYear = this.earthCycles.daysInYear();
      this.moonthOfYear = this.earthCycles.moonthOfYear();
      this.moonthsInYear = this.moonths.length;
      
    },

    setDayFromGrid:function(ev){
      ev.preventDefault();
      this.setDay(parseInt(ev.target.text))
      this.render();
    },

    setMoonthFromRow:function(ev){
      ev.preventDefault();
      this.setMoonth(parseInt(ev.target.text))
      this.render();
    },


    drawMoonthGrid: function(){
      var grid = $(this.el).find('#moonth-grid');

      for(var i = this.daysInMoonth +1; i<31; i++){
        var string = "#day"+i;
        var el = $(this.el).find(string);
        el.hide();
      }
      // grid.html('lalala')
    },

    setDay: function(day){
      if (day < 1){
        day = 1;
      }
      if (day > this.daysInMoonth){
        day = this.daysInMoonth;
      }

      var change = day - this.dayOfMoonth;

      this.dayOfMoonth = day;     
      this.dayOfYear = this.dayOfYear + change
    },

    setMoonth: function(moonth){
      if (moonth < 1){
        moonth = 1;
      }
      if (moonth > this.moonthsInYear){
        moonth = this.moonthsInYear;
      }
      this.moonthOfYear = moonth;
      this.dayOfMoonth = 1;     
      var sum = 0;
      for (i=0;i<moonth-1;i++) {
        sum += moonths[i]
      }
      this.dayOfYear = sum + 1;
      this.daysInMoonth = this.moonths[moonth-1]
    },


    dateFromGregorian: function(ev) {
      var date = new Date(ev.delegateTarget.value);
      this.earthCycles = new EarthCycles(date);
      this.render();
    },

    writeText: function() {
      var element = $(this.el).find('#date-text');
      string = "The " + this.dayOfMoonth + "/" +this.daysInMoonth + " day of the " + this.moonthOfYear + "/" + this.moonthsInYear + " Moonth of Year "
      element.html(string)
    },

    drawMoonthRow: function(){
      var row = $(this.el).find('#moonth-row');
      for(var i = 1; i< this.moonthsInYear +1; i++){
        var monthEl = document.createElement('td')
        var link = document.createElement('a')
        link.innerHTML =  i.toString()
        monthEl.appendChild(link)
        row.append(link)

      }      

    },

    render: function () {
        this.renderWithTemplate();
        this.findCanvas();
        this.drawYearCircle();
        this.drawMoonthLines();
        this.drawEarth();
        this.drawMoonCircle();
        this.drawMoon();
        this.writeText();
        this.drawMoonthGrid();
        this.drawMoonthRow();
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
      var fractionOfYear = this.dayOfYear/this.daysInYear;
      return fractionOfYear;
    },

    getEarthPosition: function(){
      angle = (Math.PI*2) * this.fractionOfYear();
      earthPoint = this.polarToCartesian(angle,this.params.radius);
      return earthPoint
    },

    getMoonPosition: function(){
      var earthPoint = this.getEarthPosition();
      var startAngle = ((Math.PI*2) * this.fractionOfYear()) - Math.PI;
      var fractionOfMoonth = this.dayOfMoonth/this.daysInMoonth;
      var moonthAngle = (Math.PI*2) * fractionOfMoonth;
      var moonPoint = this.polarToCartesian(startAngle + moonthAngle, this.params.moonRadius, earthPoint);
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
