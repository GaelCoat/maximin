
module.exports = Backbone.View.extend({

  events: {
    'click .close': 'close'
  },

  initialize: function(params) {

    this.tpl = _.template($('#tpl-img-popup').html());
    this.url = params.url;
  },

  render: function() {

    this.$el.html(this.tpl({
      url: this.url
    }));

    $('#news').append(this.$el);

    return this.show();
  },

  setUrl: function(url) {

    this.url = url;
    this.$el.find('img').attr('src', this.url);
    return this.show();
  },

  show: function() {

    this.$el.show(0).find('.veil').addClass('ready');
    return this;
  },

  close: function() {

    this.$el.find('.veil').removeClass('ready');
    this.$el.hide(0);
    $('body').removeClass('modal-open');
    return this;
  },

  reset: function() {

    //this.undelegateEvents();
    this.remove();
  }

})


