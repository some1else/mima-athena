(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.Session = (function(_super) {

    __extends(Session, _super);

    function Session() {
      Session.__super__.constructor.apply(this, arguments);
    }

    Session.prototype.defaults = {
      login: '',
      pass: '',
      token: '',
      real_name: '',
      account: ''
    };

    Session.prototype.sync = MM.Sync.Session;

    Session.prototype.url = function() {
      return MM.Sync.URL + '/api/login/' + this.get('login');
    };

    Session.prototype.saveToCookie = function() {
      var cookieData;
      cookieData = JSON.stringify({
        account: this.get('account'),
        real_name: this.get('real_name'),
        token: this.get('token')
      });
      return $.cookie('MMSessionData', cookieData, {
        path: '/',
        expires: 14
      });
    };

    Session.prototype.loadFromCookie = function() {
      var cookieData;
      cookieData = $.cookie('MMSessionData');
      if (cookieData !== null) {
        cookieData = JSON.parse(cookieData);
        return this.set(cookieData, {
          silent: true
        });
      }
    };

    Session.prototype.isLoaded = function() {
      return this.get('token') !== '' && this.get('account') !== '' && this.get('real_name') !== '';
    };

    Session.prototype.deleteCookie = function() {
      return $.cookie('MMSessionData', null);
    };

    Session.prototype.tokenChanged = function() {
      if (this.isLoaded()) return this.saveToCookie();
    };

    Session.prototype.initialize = function() {
      this.loadFromCookie();
      return this.on('change:token', this.tokenChanged);
    };

    return Session;

  })(Backbone.Model);

}).call(this);
