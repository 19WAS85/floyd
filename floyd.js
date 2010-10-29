$(function() {
  $.fn.floyd = function(options) {
    var defaults = { context: '2d' }
    var options = $.extend(defaults, options);
    
    var target = $(this)
    var container = target.get(0)
    var context = container.getContext(options.context)
    
    var brushDefaults = { stroke: 'transparent', fill: '#000' }
    var arcDefaults = { startAngle: 0, endAngle: Math.PI * 2, stroke: '#000', fill: 'transparent' }
    var pathDefaults = { style: 'stroke', color: '#000', close: false }
    var textDefaults = { baseline: 'top', align: 'left' }
    var loopDefaults = { time: 20, clear: true }
    
    var addGradientColors = function(gradient, colors) {
      for(var i = 0; i < colors.length; i++) {
        if(colors.length > 2) {
          var index = colors[i][0]
          var color = colors[i][1]
          gradient.addColorStop(index, color)
        } else {
          gradient.addColorStop(i, colors[i])
        }
      }
      return gradient
    }
    
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
      
      line : function(x0, y0, x1, y1, stroke) {
        if(stroke == null) stroke = '#000'
        context.beginPath()
        context.moveTo(x0, y0)
        context.lineTo(x1, y1)
        context.strokeStyle = stroke;
        context.stroke();
      },
      
      arc : function(x, y, s, arcOptions) {
        arcOptions = $.extend(arcDefaults, arcOptions);
        context.arc(x, y, s, arcOptions.startAngle, arcOptions.endAngle, true);
        context.strokeStyle = arcOptions.stroke
        context.fillStyle = arcOptions.fill
        context.stroke();
        context.fill();
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
      
      image : function(source, x, y, w, h) {
        var img = new Image();
        img.onload = function() {
          if(w != null) context.drawImage(img, x, y, w, h);
          else context.drawImage(img, x, y);
        }
        img.src = source;
      },
      
      gradient : function(x0, y0, x1, y1, colors) {
        var gradient = context.createLinearGradient(x0, y0, x1, y1)
        return addGradientColors(gradient, colors)
      },
      
      radialGradient : function(x0, y0, r0, x1, y1, r1, colors) {
        var gradient = context.createRadialGradient(x0, y0, r0, x1, y1, r1)
        return addGradientColors(gradient, colors)
      },
      
      text : function(content, x, y, textOptions) {
        var textOptions = $.extend(textDefaults, textOptions);
        if(textOptions.font != null) context.font = textOptions.font;
        context.textAlign = textOptions.align;
        context.textBaseline = textOptions.baseline;
        context.fillText(content, x, y);
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