var templates = require('../templates');
var View = require('ampersand-view');
// var EarthCycles = require('../earth_cycles');


module.exports = View.extend({
    pageTitle: 'more info',
    template: "<div><canvas id='cycles' width='500px;' height='500px' style='border:1px solid #000000;'></canvas></div>",
    render: function () {
        this.renderWithTemplate();
        console.log('rendering!', $(this.el).find('#cycles'));
        var canvas = $(this.el).find('#cycles')[0];
        this.drawCycles(canvas);
        // console.log('rendering!', this.el.getElementById('cycles'))
    },

    polarToCartesian: function(center, angle, length){
      x = center.x + (length * Math.cos(angle));
      y = center.y + (length * Math.sin(angle));
      return ({x:x, y:y});
    },

    drawCycles: function(canvas){
      console.log("this", this.model.earthCycles)

      center = {x: 250, y: 250}
      console.log('drawing canvas');
      context = canvas.getContext("2d");
      radius = 100
      context.arc(center.x,center.y,radius,0, 2*Math.PI);
      context.stroke();

      moonths = this.model.earthCycles.moonths
      daysInYear = this.model.earthCycles.daysInYear()
      cumulativeDays = 0
      for (i=0;i<moonths.length;i++) {
        moonthLength = moonths[i];
        cumulativeDays = cumulativeDays + moonthLength;
        console.log('cumdays', cumulativeDays)
        console.log('cuASDFmdays', daysInYear)


        fractionOfYear = cumulativeDays/daysInYear;
        console.log('frac', fractionOfYear)
        angle = (Math.PI*2) * fractionOfYear;
        console.log('angle',angle)
        context.beginPath();
        context.moveTo(center.x, center.y);
        toPoint = this.polarToCartesian(center,angle,radius);
        console.log('lineto', toPoint)
        context.lineTo(toPoint.x, toPoint.y);
        context.stroke();
      }
      
    }
});
