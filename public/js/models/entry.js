(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  MM.Entry || (MM.Entry = {});

  MM.Entry = (function(_super) {

    __extends(Entry, _super);

    function Entry() {
      this.resetSuggestedConcepts = __bind(this.resetSuggestedConcepts, this);
      this.fetchSuggestedConcepts = __bind(this.fetchSuggestedConcepts, this);
      this.resetRelevantConcepts = __bind(this.resetRelevantConcepts, this);
      this.fetchRelevantConcepts = __bind(this.fetchRelevantConcepts, this);
      Entry.__super__.constructor.apply(this, arguments);
    }

    Entry.prototype.defaults = {
      fuzz: ""
    };

    Entry.prototype.sync = MM.Sync.Entries;

    Entry.prototype.url = function(method) {
      var base, login;
      base = MM.Sync.URL;
      login = MM.session.get('account');
      switch (method) {
        case 'create':
          return "" + base + "/entry/" + login;
        case 'read':
          return "" + base + "/entries/" + login;
        case 'delete':
          return "" + base + "/entry/" + login;
      }
    };

    Entry.prototype.initializeConcepts = function() {
      this.relevantConcepts = new MM.Entry.RelevantConcepts({
        entry: this
      });
      return this.suggestedConcepts = new MM.Entry.SuggestedConcepts({
        entry: this
      });
    };

    Entry.prototype.initialize = function() {
      this.oldFuzz = this.get('fuzz');
      return this.initializeConcepts();
    };

    Entry.prototype.getChompedFuzz = function() {
      return this.get('fuzz').replace(/^(\n|\r|\t)+$/, '');
    };

    Entry.prototype.fetchRelevantConcepts = function() {
      var options;
      this.newFuzz = this.get('fuzz');
      if (this.newFuzz !== this.oldFuzz) {
        this.oldFuzz = this.newFuzz;
        options = {
          q: this.newFuzz,
          limit: 7
        };
        return this.relevantConcepts.fetch({
          data: options
        });
      }
    };

    Entry.prototype.resetRelevantConcepts = function() {
      return this.relevantConcepts.reset();
    };

    Entry.prototype.fetchSuggestedConcepts = function() {
      var options;
      options = {
        q: this.get('fuzz')
      };
      return this.suggestedConcepts.fetch({
        data: options
      });
    };

    Entry.prototype.resetSuggestedConcepts = function() {
      return this.suggestedConcepts.reset();
    };

    Entry.prototype.appendRelevantConcept = function(concept) {
      this.set('fuzz', this.get('fuzz') + ' ' + concept.toString());
      return this.trigger('relevantConceptAppended');
    };

    Entry.prototype.parse = function(values) {
      var entry;
      entry = {
        id: values.id,
        status: values.status,
        state: values.state,
        fuzz: values.fuzz,
        url: values.url,
        text: values.text,
        description: values.description,
        kind: values.type,
        prettytime: values.prettytimecreated,
        aims: values.aims,
        fg: values.fg,
        wf_id: values.wfid
      };
      return entry;
    };

    return Entry;

  })(Backbone.Model);

  MM.Entries = (function(_super) {

    __extends(Entries, _super);

    function Entries() {
      this.onSyncError = __bind(this.onSyncError, this);
      Entries.__super__.constructor.apply(this, arguments);
    }

    Entries.prototype.model = MM.Entry;

    Entries.prototype.sync = MM.Sync.Entries;

    Entries.prototype.url = function(method) {
      var base, login;
      base = MM.Sync.URL;
      login = MM.session.get('account');
      switch (method) {
        case 'create':
          return "" + base + "/entry/" + login;
        case 'read':
          return "" + base + "/entries/" + login;
      }
    };

    Entries.prototype.parse = function(response) {
      if (_.isObject(response.entries) && _.isArray(response.entries.items) && response.entries.items.length > 0) {
        return response.entries.items;
      } else {
        return [];
      }
    };

    Entries.prototype.onSyncError = function(model, response) {
      console.log(this, 'onSyncError', model, response);
      if (response.status === 'timeout') {
        return console.log(this, 'onSyncError', 'It was a timeout');
      }
    };

    Entries.prototype.initialize = function() {
      return console.log(this, '#initialize');
    };

    return Entries;

  })(Backbone.Collection);

  MM.Entry.RelevantConcepts = (function(_super) {

    __extends(RelevantConcepts, _super);

    function RelevantConcepts() {
      RelevantConcepts.__super__.constructor.apply(this, arguments);
    }

    RelevantConcepts.prototype.model = MM.Concept;

    RelevantConcepts.prototype.sync = MM.Sync.RelevantConcepts;

    RelevantConcepts.prototype.url = function() {
      var base, login;
      base = MM.Sync.URL;
      login = MM.session.get('account');
      return "" + base + "/relevant/" + login;
    };

    RelevantConcepts.prototype.parse = function(response) {
      if (_.isArray(response.entities) && response.entities.length > 0) {
        return response.entities;
      } else {
        return [];
      }
    };

    RelevantConcepts.prototype.comparator = function(concept) {
      return parseFloat(concept.get("weight")) * -1;
    };

    RelevantConcepts.prototype.initialize = function(options) {
      return this.entry = options.entry;
    };

    return RelevantConcepts;

  })(Backbone.Collection);

  MM.Entry.SuggestedConcept = (function(_super) {

    __extends(SuggestedConcept, _super);

    function SuggestedConcept() {
      SuggestedConcept.__super__.constructor.apply(this, arguments);
    }

    SuggestedConcept.prototype.parse = function(suggestion) {
      console.log(this, '#parse', suggestion);
      return suggestion;
    };

    SuggestedConcept.prototype.initialize = function() {
      return console.log(this);
    };

    return SuggestedConcept;

  })(Backbone.Model);

  MM.Entry.SuggestedConcepts = (function(_super) {

    __extends(SuggestedConcepts, _super);

    function SuggestedConcepts() {
      SuggestedConcepts.__super__.constructor.apply(this, arguments);
    }

    SuggestedConcepts.prototype.model = MM.Concept;

    SuggestedConcepts.prototype.sync = MM.Sync.SuggestedConcepts;

    SuggestedConcepts.prototype.url = function() {
      var base, login;
      base = MM.Sync.URL;
      login = MM.session.get('account');
      return "" + base + "/suggestions/" + login;
    };

    SuggestedConcepts.prototype.parse = function(suggestions) {
      if (suggestions.length !== 0) {
        return [
          {
            'label': 'dev',
            'type': 'TAG'
          }, {
            'label': 'mima',
            'type': 'TAG'
          }
        ];
      } else {
        return [];
      }
    };

    SuggestedConcepts.prototype._prepareModel = function(model, options) {
      var attrs, modelClass;
      if (!(model instanceof Backbone.Model)) {
        attrs = model;
        options.collection = this;
        if (_.isString(attrs.type)) {
          switch (attrs.type.toUpperCase()) {
            case 'TAG':
              modelClass = MM.Concepts.Tag;
              break;
            case 'PERSON':
              modelClass = MM.Concepts.Person;
              break;
            case 'PLACE':
              modelClass = MM.Concepts.Place;
              break;
            case 'TIME':
              modelClass = MM.Concepts.Time;
          }
          model = new modelClass(attrs, options);
        } else {
          model = new this.model(attrs, options);
        }
        if (!model._validate(model.attributes, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    };

    SuggestedConcepts.prototype.initialize = function() {};

    return SuggestedConcepts;

  })(Backbone.Collection);

}).call(this);
