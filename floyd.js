$(function() {
  $.fn.floyd = function(options) {
    var defaults = { context: '2d' }
    var options = $.extend(defaults, options);
    
    var target = $(this)
    var container = target.get(0)
    var context = container.getContext(options.context)
    
    var brushDefaults = { stroke: 'transparent', fill: '#000' }
    
    var pathDefaults = { style: 'stroke', color: '#000', close: false }
    
    var loopDefaults = { time: 20, clear: true }
    
    return {
      target: target,
      container: container,
      board: board,
      
      rect : function(x, y, w, h, brush) {
        brush = $.extend(brushDefaults, brush);
        context.strokeStyle = brush.stroke
        context.fillStyle = brush.fill
        context.strokeRect(x, y, w, h)
        context.fillRect(x, y, w, h)
      },
      
      square : function(x, y, s, brush) {
        this.rect(x, y, s, s, brush)
      },
      
      line : function(x1, y1, x2, y2, stroke) {
        if(stroke == null) stroke = '#000'
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.strokeStyle = stroke;
        context.stroke();
      },
      
      arc : function() {
        // TODO!
      },
      
      path : function(points, pathOptions) {
        pathOptions = $.extend(pathDefaults, pathOptions);
        context.beginPath()
        for(var i = 0; i < points.length; i++) {
          var begin = points[i][0]
          var end = points[i][1]
          if(i == 0) context.moveTo(begin, end)
          else context.lineTo(begin, end)
        }
        if(pathOptions.close) context.closePath()
        switch(pathOptions.style) {
          case 'stroke':
            context.strokeStyle = pathOptions.color;
            context.stroke();
            break
          case 'fill':
            context.fillStyle = pathOptions.color;
            context.fill();
            break
        }
      },
      
      gradient : function() {
        // TODO!
      },
      
      clear : function() {
        container.width = container.width
      },
      
      loop : function(drawing, loopOptions) {
        loopOptions = $.extend(loopDefaults, loopOptions);
        var draw = function() {
        if(loopOptions.clear) container.width = container.width
          drawing()
          setTimeout(draw, loopOptions.time)
        }
        draw()
      }
    }
  }
})