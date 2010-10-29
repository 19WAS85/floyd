$(function() {
  $.fn.floyd = function(options) {
    var defaults = { context: '2d' }
    var options = $.extend(defaults, options);

    var target = $(this)
    var container = target.get(0)
    var board = container.getContext(options.context)
    
    var brushDefaults = { stroke: 'transparent', fill: '#000' }
	
	var loopDefaults = { time: 20, clear: true }
    
    return {
      target: target,
      container: container,
      board: board,

      rect : function(x, y, w, h, brush) {
        brush = $.extend(brushDefaults, brush);
        board.strokeStyle = brush.stroke
        board.fillStyle = brush.fill
        
        board.strokeRect(x, y, w, h)
        board.fillRect(x, y, w, h)
      },
      
      square : function(x, y, s, brush) {
        this.rect(x, y, s, s, brush)
      },
      
      line : function(x1, y1, x2, y2, stroke) {
        if(stroke == null) stroke = '#000'
        board.beginPath()
        board.moveTo(x1, y1)
        board.lineTo(x2, y2)
        board.strokeStyle = stroke;
        board.stroke();
        board.closePath();
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