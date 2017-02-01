
module.exports = Backbone.View.extend({

  mousePos: { x: -1, y: -1 },
  windowHeight: $(window).height(),
  windowWidth: $(window).width(),

  locked: false,

  initialize: function(params) {

    var that = this;

    this.offset = params.offset;
    this.listenTo(Backbone, 'mousemove', this.update);
    this.listenTo(Backbone, 'repulse:lock', function() { that.locked = true; });
    this.listenTo(Backbone, 'repulse:unlock', function() { that.locked = false; });
  },

  update: function(e) {

    if (this.locked) return this;

    this.mousePos.x = (e.pageX || e.clientX) - (this.windowWidth/2);
    this.mousePos.y = (e.pageY || e.clientY) - (this.windowHeight/2);

    var transX = this.mousePos.x * (this.offset / 100);
    var transY = this.mousePos.y * (this.offset / 100);

    this.$el.css({
      'transform': 'translate3d('+transX+'px,'+transY+'px, 0px)',
      '-webkit-transform': 'translate3d('+transX+'px,'+transY+'px, 0px)'
    });

    return this;
  },

  render: function() {

    return this;
  },

  reset: function() {

    //this.undelegateEvents();
    this.remove();
  }

})


