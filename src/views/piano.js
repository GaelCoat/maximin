var notes = require('./notes');
var Player = require('./player');
var Canvas = require('./canvas');

module.exports = Backbone.View.extend({

  events: {
    'keypress': 'getNote'
  },

  player: null,
  canvas: null,

  initialize: function(params) {

  },

  initPlayer: function() {

    this.player = new Player({el: $('.parts')});
    this.player.render();
    this.player.on('play', this.getNote.bind(this));
    return this;
  },

  initCanvas: function() {

    this.canvas = new Canvas({el: $('.canvas')});
    this.canvas.render();
    return this;
  },

  getNote: function(e) {

    return this.play(notes[e.key || e], e)
  },

  play: function(note, e) {

    var sound = this.$el.find('#'+note).clone();
    if (sound.length === 0) return true;

    this.canvas.add(e.key || e);

    this.$el.find("li[data-note='"+note+"']").addClass('pressed').delay(300).queue(function(done){

      $(this).removeClass('pressed');
      done();
    });

    sound.get(0).volume = 0.2;
    sound.get(0).play();
    sound.get(0).onended = function() {
      sound.remove();
    };

    return this;
  },

  render: function() {

    console.log(this.$el.find('.whites li').length);
    console.log(this.$el.find('.blacks li').length);

    return [
      this.initPlayer(),
      this.initCanvas()
    ]
  },

})


