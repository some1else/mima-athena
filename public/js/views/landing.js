(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.Views || (MM.Views = {});

  MM.Views.Landing = (function(_super) {

    __extends(Landing, _super);

    function Landing() {
      this.render = __bind(this.render, this);
      Landing.__super__.constructor.apply(this, arguments);
    }

    Landing.prototype.template = _.template("<div id='upperLoginSignupForm'></div><div id='lowerLoginSignupForm'></div>");

    Landing.prototype.id = 'views-landing';

    Landing.prototype.initialize = function() {
      var login;
      login = new MM.Login({
        login: 'devuser1',
        password: 'admin123'
      });
      this.upperLoginSignupForm = new MM.Views.LoginSignupForm({
        model: login
      });
      return this.lowerLoginSignupForm = new MM.Views.LoginSignupForm({
        model: login
      });
    };

    Landing.prototype.render = function() {
      var lowerLoginSignupFormEl, upperLoginSignupFormEl;
      this.$el.html(this.template());
      upperLoginSignupFormEl = this.$('#upperLoginSignupForm');
      upperLoginSignupFormEl.replaceWith(this.upperLoginSignupForm.render().el);
      lowerLoginSignupFormEl = this.$('#lowerLoginSignupForm');
      lowerLoginSignupFormEl.replaceWith(this.lowerLoginSignupForm.render().el);
      return this;
    };

    return Landing;

  })(Backbone.View);

}).call(this);
