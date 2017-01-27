
var Main = Backbone.View.extend({


  initialize: function(params) {

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

    return q.fcall(function() {

      that.renderParticle();

    });

  },

});

var View = new Main({el: $('body')});
View.render();

