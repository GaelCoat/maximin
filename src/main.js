var Lightbox = require('./views/lightbox');
var Repulsed = require('./views/repulsed');
var Salvattore = require('salvattore');
var Trianglify = require('trianglify');
var isMobile = require('./libs/isMobile');

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  escape: /\{\{\-(.+?)\}\}/g,
  evaluate: /\<\%(.+?)\%\>/gim
};

var Main = Backbone.View.extend({

  events: {
    'click #video': 'togglePlay',
    'mousemove #news .overlay': 'sweg',
    'mouseleave #news .overlay': 'unsweg',
    'click #news .wrap': 'newLightbox',
  },

  isPaused: false,

  currentLightbox: null,

  initialize: function(params) {

  },

  // ------------------------------------------------
  // Render perspective on instagram tiles
  // ------------------------------------------------
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

  // ------------------------------------------------
  // Remove perspective on instagram tiles
  // ------------------------------------------------
  unsweg: function(e) {

    var tuile = $(e.currentTarget).parent();

    tuile.css({
      'transform': 'none',
      '-webkit-transform': 'none',
      'transition': '.44s',
      '-webkit-transition': '.44s'
    })

  },

  // ------------------------------------------------
  // Handle Video state
  // ------------------------------------------------
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

  // ------------------------------------------------
  // Handle onScroll shite
  // ------------------------------------------------
  scroll: function() {

    var scrollTop = $(window).scrollTop();
    var viewportHeight = $(window).height();
    var triggerTop = this.$el.find('#video').offset().top;
    var triggerBot = this.$el.find('#video').offset().top + this.$el.find('#video').height();
    var video = this.$el.find('#player');

    if (scrollTop >= viewportHeight*0.8) Backbone.trigger('repulse:lock');
    else Backbone.trigger('repulse:unlock');

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

  // ------------------------------------------------
  // Picture popup
  // ------------------------------------------------
  newLightbox: function(e) {

    var url = this.$el.find(e.currentTarget).find('img').attr('src');

    this.$el.addClass('modal-open');

    if (this.currentLightbox) return this.currentLightbox.setUrl(url);
    this.currentLightbox = new Lightbox({url: url});
    this.currentLightbox.render();

    return this;
  },

  // ------------------------------------------------
  // Render 1 particle
  // ------------------------------------------------
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

  // ------------------------------------------------
  // Generate background particles
  // ------------------------------------------------
  generateParticles: function() {

    this.renderParticle(this.$el.find('#particles'));
    setTimeout(this.generateParticles.bind(this), 400);
    return this;
  },

  // ------------------------------------------------
  // Preload all pictures, return percentage
  // ------------------------------------------------
  preload: function() {

    var that = this;
    var ready = [];

    var total = this.$el.find('img').length;
    var percent = 0;

    this.$el.find('img').each(function(i) {

      var defer = q.defer();

      var $this = $(this);
      var url = $this.data('src');
      var img = new Image();
      img.src = url;
      img.onload = function() {

        percent += 100/total;

        that.$el.find('#loader span').text(Math.round(percent)+'%');

        $this.attr('src', url).removeClass('preload');
        defer.resolve(url);
      };

      ready.push(defer.promise);
    });

    return ready;
  },

  // ------------------------------------------------
  // Start loading the video
  // ------------------------------------------------
  loadVideo: function() {

    if (isMobile) this.$el.find('video').attr('controls','true');

    this.$el.find('video').attr('src', this.$el.find('video').data('src'));
    return this;
  },

  // ------------------------------------------------
  // Generate the Triangle canvas
  // ------------------------------------------------
  renderTrianglify: function() {

    this.$el.find('canvas').remove();

    var pattern = Trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
      cell_size: 150,
      x_colors: ['#000000', '#232323', '#050505']
    });

    this.$el.prepend(pattern.canvas());
    return this;
  },

  initRepulse: function () {

    if (isMobile) return this;

    this.$el.find('.repulse').each(function() {

      var offset = $(this).data('pulse');
      var View = new Repulsed({el: $(this), offset: offset});
      View.render();
    });
  },

  setSizes: function() {

    var that = this;

    this.$el.find('.setSize').each(function() {

      $(this).height($(this).height());

    });

    return this;
  },

  render: function() {

    var that = this;

    $(window).scroll(this.scroll.bind(this));
    $(window).mousemove(_.throttle(function(e) { Backbone.trigger('mousemove', e); }, 65));
    $(window).resize(_.throttle(function(e) {

      Backbone.trigger('resize', e);
      return that.renderTrianglify();
    }, 300));

    return q.fcall(that.preload.bind(that))
    .all()
    .then(function() {

      // Fin du loader
      that.$el.find('#loader').delay(1000).fadeOut(400, function() {

        that.$el.addClass('ready').removeClass('modal-open');
      });

      if (isMobile) that.setSizes();

      return [
        that.renderTrianglify(),
        that.generateParticles(),
        that.initRepulse(),
        that.loadVideo()
      ]
    })

  },

});

var View = new Main({el: $('body')});
View.render();

