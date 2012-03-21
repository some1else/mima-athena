(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.App = (function(_super) {

    __extends(App, _super);

    function App() {
      this.onTokenChanged = __bind(this.onTokenChanged, this);
      App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.routes = {
      '': 'redirect',
      'landing': 'landing',
      'agenda': 'agenda',
      'meanxy': 'meanxy',
      'login': 'login'
    };

    App.prototype.landing = function() {
      this.view = new MM.Views.Landing();
      this.$stage.html(this.view.render().el);
      return this.nav.hide();
    };

    App.prototype.login = function() {
      this.view = new MM.Views.Login();
      this.$stage.html(this.view.render().el);
      return this.nav.hide();
    };

    App.prototype.agenda = function() {
      this.ensureSession();
      this.view = new MM.Views.Agenda();
      this.$stage.html(this.view.render().el);
      this.view.onRendered();
      return this.nav.show();
    };

    App.prototype.meanxy = function() {
      var tiles;
      this.ensureSession();
      tiles = new MM.MeanXY.TileCollection();
      this.view = new MM.MeanXY.Views.Tiles({
        collection: tiles
      });
      this.$el.html(this.view.render().el);
      return this.nav.show();
    };

    App.prototype.redirect = function() {
      if (MM.session.isLoaded()) {
        return this.navigate('agenda', true);
      } else {
        return this.navigate('landing', true);
      }
    };

    App.prototype.initialize = function() {
      this.assignDOMElements();
      this.initNav();
      this.initSession();
      return this.initWorkflows();
    };

    App.prototype.assignDOMElements = function() {
      this.$app = $('#app');
      this.$nav = $('#views-navbar');
      return this.$stage = $('#stage');
    };

    App.prototype.initNav = function() {
      this.nav = new MM.Views.Nav();
      return this.$nav.html(this.nav.render().el);
    };

    App.prototype.initWorkflows = function() {
      if (!MM.workflows) return MM.workflows = new MM.Workflows();
    };

    App.prototype.initSession = function() {
      if (!MM.session) MM.session = new MM.Session();
      return MM.session.on('change:token', this.onTokenChanged);
    };

    App.prototype.resetSession = function() {
      if (MM.session) {
        MM.session.off('change:token', this.onTokenChanged);
        MM.session.deleteCookie();
        delete MM.session;
      }
      MM.session = new MM.Session();
      return MM.session.on('change:token', this.onTokenChanged);
    };

    App.prototype.onTokenChanged = function() {
      return this.navigate('agenda', true);
    };

    App.prototype.ensureSession = function() {
      if (!MM.session.isLoaded()) return this.navigate('landing', true);
    };

    return App;

  })(Backbone.Router);

}).call(this);
