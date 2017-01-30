
var Main = Backbone.View.extend({


  initialize: function(params) {

  },

  scroll: function() {

    var scrollTop = $(window).scrollTop();
    var viewportHeight = $(window).height();
    var trigger = this.$el.find('#video').offset().top;
    var video = this.$el.find('#player')

    if (scrollTop + viewportHeight * 0.9 >= trigger) video.get(0).play();
    else video.get(0).pause();
    return this;
  },

  renderParticle: function() {

    var scene = this.$el.find('#particles');
    var elem = $('<i>');
    var maxWidth = scene.width();
    var maxHeight = scene.height();
    var size = Math.floor((Math.random() * 20) + 10);

    // Type picker
    var possibleTypes = ['circle', 'cross'];
    var type = possibleTypes[Math.floor((Math.random() * 2) + 0)];

    // Color picker
    var possibleColors = ['blue', 'red', 'grey'];
    var color = possibleColors[Math.floor((Math.random() * 3) + 0)];

    elem.attr('class', type+' '+color);
    elem.css({
      'top': Math.random()*maxHeight+'px',
      'left': Math.random()*maxWidth+'px',
      'width': size,
      'height': size
    });

    scene.append(elem);

    elem.show(0).addClass('ready').delay(1700).queue(function(done) {

      elem.remove();
      done();
    });

    setTimeout(this.renderParticle.bind(this), 300);
    return this;
  },

  render: function() {

    var that = this;

    $(window).scroll(this.scroll.bind(this));

    return q.fcall(function() {

      return that.renderParticle();
    })
    .delay(1000)
    .then(function() {

      that.$el.addClass('ready');
      return that;
    })

  },

});

var View = new Main({el: $('body')});
View.render();

