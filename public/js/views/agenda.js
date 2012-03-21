(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.Views || (MM.Views = {});

  MM.Views.Agenda = (function(_super) {

    __extends(Agenda, _super);

    function Agenda() {
      this.onFetchError = __bind(this.onFetchError, this);
      this.onRendered = __bind(this.onRendered, this);
      this.render = __bind(this.render, this);
      this.searchForEntries = __bind(this.searchForEntries, this);
      Agenda.__super__.constructor.apply(this, arguments);
    }

    Agenda.prototype.template = _.template("");

    Agenda.prototype.id = 'views-agenda';

    Agenda.prototype.initialize = function() {
      this.entry = new MM.Entry();
      this.entries = new MM.Entries();
      this.entriesView = new MM.Views.Entries({
        collection: this.entries,
        agenda: this
      });
      this.awsmBar = new MM.Views.AwsmBar({
        model: this.entry,
        entries: this.entries,
        agenda: this
      });
      this.fetchWorkflows();
      this.fetchEntries();
      return this.bindEntriesSearch(this.entry);
    };

    Agenda.prototype.fetchEntries = function() {
      var options;
      options = _.extend(this.getFetchRequestOptions(), this.getFetchErrorOptions());
      return this.entries.fetch(options);
    };

    Agenda.prototype.fetchWorkflows = function() {
      return MM.workflows.fetch();
    };

    Agenda.prototype.bindEntriesSearch = function(entry) {
      return entry.on('change:fuzz', this.searchForEntries);
    };

    Agenda.prototype.unBindEntriesSearch = function(entry) {
      return entry.off('change:fuzz', this.searchForEntries);
    };

    Agenda.prototype.searchForEntries = function(model, fuzz) {
      var options, query;
      query = model.getChompedFuzz();
      if (query !== '') {
        options = {
          data: {
            _Es: query,
            _El: 'off'
          }
        };
        options = _.extend(options, this.getFetchErrorOptions());
        return this.entries.fetch(options);
      } else {
        return this.entries.fetch(this.getFetchRequestOptions());
      }
    };

    Agenda.prototype.render = function() {
      this.$el.html(this.template());
      this.$el.append(this.awsmBar.render().el);
      this.$el.append(this.entriesView.render().el);
      return this;
    };

    Agenda.prototype.onRendered = function() {
      return this.awsmBar.onRendered();
    };

    Agenda.prototype.getFetchRequestOptions = function() {
      return {
        data: {
          _El: 'off'
        }
      };
    };

    Agenda.prototype.getFetchErrorOptions = function() {
      var _this = this;
      return {
        success: function(model, resp) {
          if (_.isString(resp.error)) return _this.onFetchError(model, resp);
        },
        error: function(model, resp) {
          console.log(_this, '#fetchErrorOptions.error', model, resp);
          resp = {
            error: 'Timeout'
          };
          return _this.onFetchError(model, resp);
        }
      };
    };

    Agenda.prototype.onFetchError = function(model, resp) {
      resp || (resp = {
        error: ''
      });
      switch (resp.error) {
        case 'Failed user auth':
          MM.app.resetSession();
          return _.defer(function() {
            return MM.app.navigate('login', true);
          });
        case 'Timeout':
          return console.log(this, '#onFetchError', 'Timeout');
        default:
          return console.log(this, '#onFetchError', 'Unknown Error');
      }
    };

    Agenda.prototype.focusAwsmBar = function() {
      return this.awsmBar.focus();
    };

    return Agenda;

  })(Backbone.View);

}).call(this);
