(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.Views || (MM.Views = {});

  MM.Views.Nav = (function(_super) {

    __extends(Nav, _super);

    function Nav() {
      this.render = __bind(this.render, this);
      this.logOut = __bind(this.logOut, this);
      this.gotoMeanXY = __bind(this.gotoMeanXY, this);
      this.gotoAgenda = __bind(this.gotoAgenda, this);
      Nav.__super__.constructor.apply(this, arguments);
    }

    Nav.prototype.className = 'navbar-inner';

    Nav.prototype.template = _.template("<div class='navbar-inner'>                          <h1><a class='brand' href='/'>middlemachine</a></h1>                          <ul class='nav'>                            <li><a class='agenda' href='/agenda'>Agenda</a></li>                            <li><a class='meanxy' href='/meanxy'>MeanXY</a></li>                            <li><a class='logout' href='/logout'>Log out</a></li>                          </ul>                        </div>");

    Nav.prototype.events = {
      'click .agenda': 'gotoAgenda',
      'click .meanxy': 'gotoMeanXY',
      'click .logout': 'logOut'
    };

    Nav.prototype.gotoAgenda = function(e) {
      e.preventDefault();
      return MM.app.navigate('agenda');
    };

    Nav.prototype.gotoMeanXY = function(e) {
      e.preventDefault();
      return MM.app.navigate('meanxy');
    };

    Nav.prototype.logOut = function(e) {
      e.preventDefault();
      MM.app.resetSession();
      MM.app.navigate('', true);
      return console.log(this, 'logOut');
    };

    Nav.prototype.render = function() {
      this.$el.html(this.template());
      this.hide();
      return this;
    };

    Nav.prototype.show = function() {
      return this.$el.show();
    };

    Nav.prototype.hide = function() {
      return this.$el.hide();
    };

    Nav.prototype.initialize = function() {};

    return Nav;

  })(Backbone.View);

}).call(this);
