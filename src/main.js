var Lightbox = require('./views/lightbox');
var Salvattore = require('salvattore');

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  escape: /\{\{\-(.+?)\}\}/g,
  evaluate: /\<\%(.+?)\%\>/gim
};

var Main = Backbone.View.extend({

  events: {
    'click #video': 'togglePlay',
    //'mousemove #news .wrap': 'fluze',
    'mousemove #news .overlay': 'sweg',
    'mouseleave #news .overlay': 'unsweg',
    'click #news .wrap': 'newLightbox',
  },

  isPaused: false,

  currentLightbox: null,

  initialize: function(params) {

  },

  fluze: _.throttle(function(e) {

    var container = $(e.currentTarget).find('.overlay');
    return this.renderParticle(container, 'white');
  }, 300),

  sweg: function(e) {

    var tuile = $(e.currentTarget).parent();
    var width = tuile.width();
    var height = tuile.height();
    var multiplier = 50;

    var rotates = {
      x: (e.offsetX - width/2) / multiplier,
      y: (e.offsetY - height/2) / multiplier
    };

    if (rotates.y >= 4.5) rotates.y = 4.5;
    if (rotates.y <= -4.5) rotates.y = -4.5;

    tuile.css({
      'transform': 'perspective(700px) rotateX('+rotates.y+'deg) rotateY('+rotates.x+'deg) ',
      '-webkit-transform': 'perspective(700px) rotateX('+rotates.y+'deg) rotateY('+rotates.x+'deg) ',
      'transition': '0s',
      '-webkit-transition': '0s'
    });

    return this;
  },

  unsweg: function(e) {

    var tuile = $(e.currentTarget).parent();

    tuile.css({
      'transform': 'perspective(0) rotateX(0deg) rotateY(0deg) ',
      '-webkit-transform': 'perspective(0) rotateX(0deg) rotateY(0deg) ',
      'transition': '.44s',
      '-webkit-transition': '.44s'
    })

  },

  togglePlay: function() {

    var video = this.$el.find('#player');
    var section = this.$el.find('#video');

    if (section.hasClass('paused')) {

      section.removeClass('paused');
      this.isPaused = false;
      video.get(0).play();

    } else {

      this.isPaused = true;
      section.addClass('paused');
      video.get(0).pause();
    }

    return this;
  },

  scroll: function() {

    var scrollTop = $(window).scrollTop();
    var viewportHeight = $(window).height();
    var triggerTop = this.$el.find('#video').offset().top;
    var triggerBot = this.$el.find('#video').offset().top + this.$el.find('#video').height();
    var video = this.$el.find('#player');

    // Bio
    if (scrollTop >= viewportHeight/2) this.$el.find('#bio').addClass('loaded');

    // Videos
    if (this.isPaused) return this;
    if (scrollTop + viewportHeight * 0.5 >= triggerTop && scrollTop * 1.2 <= triggerBot) {

      this.$el.find('#video').removeClass('paused');
      video.get(0).play();

    } else {

      this.$el.find('#video').addClass('paused');
      video.get(0).pause();
    }
    return this;
  },

  newLightbox: function(e) {


    var url = this.$el.find(e.currentTarget).find('img').attr('src');

    this.$el.addClass('modal-open');

    if (this.currentLightbox) return this.currentLightbox.setUrl(url);
    this.currentLightbox = new Lightbox({url: url});
    this.currentLightbox.render();

    return this;
  },

  renderParticle: function(container, color) {

    var scene = container;
    var elem = $('<i>');
    var maxWidth = scene.width();
    var maxHeight = scene.height();
    var size = Math.floor(Math.random() * (60 - 15 + 1)) + 15;

    // Type picker
    var possibleTypes = ['circle', 'cross'];
    var type = possibleTypes[Math.floor((Math.random() * 2) + 0)];

    // Color picker
    var possibleColors = ['blue', 'red', 'grey'];
    if (!color) var color = possibleColors[Math.floor((Math.random() * 3) + 0)];

    elem.attr('class', type+' particle '+color);
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

    return this;
  },

  generateParticles: function() {

    this.renderParticle(this.$el.find('#particles'));
    setTimeout(this.generateParticles.bind(this), 300);
  },

  render: function() {

    var that = this;

    $(window).scroll(this.scroll.bind(this));

    return q.fcall(function() {

      return that.generateParticles();
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

