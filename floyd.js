$(function() {
  $.fn.floyd = function(options) {
    var defaults = { context: '2d' }
    var options = $.extend(defaults, options);
    
    var target = $(this)
    var container = target.get(0)
    var context = container.getContext(options.context)
    
    var shadowDefaults = { blur: 5, color: 'gray' }
    var brushDefaults = { stroke: 'transparent', fill: 'black' }
    var arcDefaults = { startAngle: 0, endAngle: Math.PI * 2, stroke: 'black', fill: 'transparent' }
    var pathDefaults = { style: 'stroke', color: 'black', close: false }
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
    
    var checkEffects = function(context, effects) {
      if(effects != null) {
        if(effects.shadow != null) {
          shadow = $.extend(shadowDefaults, effects.shadow);
          context.shadowOffsetX = shadow.x;
          context.shadowOffsetY = shadow.y;
          context.shadowBlur = shadow.blur;
          context.shadowColor = shadow.color;
        }
        if(effects.rotate != null) {
          context.rotate(effects.rotate)
        }
      }
      return context
    }
    
    return {
      target: target,
      container: container,
      
      rect : function(x, y, w, h, brush) {
        brush = $.extend(brushDefaults, brush);
        context.strokeStyle = brush.stroke
        context.fillStyle = brush.fill
        context = checkEffects(context, brush)
        context.strokeRect(x, y, w, h)
        context.fillRect(x, y, w, h)
      },
      
      square : function(x, y, s, brush) {
        this.rect(x, y, s, s, brush)
      },
      
      line : function(x0, y0, x1, y1, stroke) {
        if(stroke == null) stroke = 'black'
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
        context = checkEffects(context, arcOptions)
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
        context = checkEffects(context, pathOptions)
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
      
      image : function(source, x, y, imageOptions) {
        var img = new Image();
        img.onload = function() {
          context = checkEffects(context, imageOptions)
          if(imageOptions != null && imageOptions.width != null) {
            context.drawImage(img, x, y, imageOptions.width, imageOptions.height);
          } else {
            context.drawImage(img, x, y);
          }
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
        context = checkEffects(context, textOptions)
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