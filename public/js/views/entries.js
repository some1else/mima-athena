(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.Views || (MM.Views = {});

  MM.Views.Entries = (function(_super) {

    __extends(Entries, _super);

    function Entries() {
      this.render = __bind(this.render, this);
      this.reset = __bind(this.reset, this);
      this.add = __bind(this.add, this);
      Entries.__super__.constructor.apply(this, arguments);
    }

    Entries.prototype.className = 'entries';

    Entries.prototype.template = _.template('');

    Entries.prototype.add = function(entry, append) {
      var view;
      if (append == null) append = false;
      view = new MM.Views.Entry({
        model: entry
      });
      if (append) {
        return this.$el.append(view.render().el);
      } else {
        return this.$el.prepend(view.render().el);
      }
    };

    Entries.prototype.reset = function() {
      var entry, _i, _len, _ref, _results;
      console.log(this, '#reset', this.collection);
      this.render();
      _ref = this.collection.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        _results.push(this.add(entry, {
          append: true
        }));
      }
      return _results;
    };

    Entries.prototype.render = function() {
      this.$el.html(this.template());
      return this;
    };

    Entries.prototype.initialize = function() {
      this.collection.on('reset', this.reset);
      return this.collection.on('add', this.add);
    };

    return Entries;

  })(Backbone.View);

  MM.Views.Entry = (function(_super) {

    __extends(Entry, _super);

    function Entry() {
      this.render = __bind(this.render, this);
      this.editOrDestroy = __bind(this.editOrDestroy, this);
      Entry.__super__.constructor.apply(this, arguments);
    }

    Entry.prototype.template = _.template('<span class="fuzz"><%= fuzz %></span>');

    Entry.prototype.className = 'entry';

    Entry.prototype.events = {
      'click': 'editOrDestroy'
    };

    Entry.prototype.editOrDestroy = function(e) {
      e.preventDefault();
      if (e.shiftKey) {
        return this.destroy();
      } else {

      }
    };

    Entry.prototype.destroy = function() {
      this.model.destroy();
      return this.$el.remove();
    };

    Entry.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      if (this.model.hasWorkflow()) this.$el.append(this.workflow.render().el);
      return this;
    };

    Entry.prototype.initialize = function() {
      if (this.model.hasWorkflow()) {
        return this.workflow = new MM.Views.EntryWorkflow({
          model: this.model
        });
      }
    };

    return Entry;

  })(Backbone.View);

  MM.Views.EntryWorkflow = (function(_super) {

    __extends(EntryWorkflow, _super);

    function EntryWorkflow() {
      this.render = __bind(this.render, this);
      EntryWorkflow.__super__.constructor.apply(this, arguments);
    }

    EntryWorkflow.prototype.template = _.template('\
    <div class="btn-group">\
      <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">\
        <%= workflow_label %>\
        <span class="caret"></span>\
      </a>\
      <ul class="dropdown-menu">\
      </ul>\
    </div>\
  ');

    EntryWorkflow.prototype.className = 'state';

    EntryWorkflow.prototype.render = function() {
      var state, stateOption, _i, _len, _ref;
      this.$el.html(this.template(this.model.toJSON()));
      this.$dropdown = this.$('.dropdown-menu');
      _ref = this.model.workflow.states;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        state = _ref[_i];
        stateOption = new MM.Views.EntryStateOption({
          model: state,
          entry: this.model
        });
        this.$dropdown.append(stateOption.render().el);
      }
      return this;
    };

    return EntryWorkflow;

  })(Backbone.View);

  MM.Views.EntryStateOption = (function(_super) {

    __extends(EntryStateOption, _super);

    function EntryStateOption() {
      this.change = __bind(this.change, this);
      EntryStateOption.__super__.constructor.apply(this, arguments);
    }

    EntryStateOption.prototype.template = _.template('<a href="#"><%= label %></a>');

    EntryStateOption.prototype.tagName = 'li';

    EntryStateOption.prototype.events = {
      'click': 'change'
    };

    EntryStateOption.prototype.change = function(e) {
      e.preventDefault();
      this.entry.set({
        fg: this.model.get('fg_id'),
        status: this.model.get('label')
      });
      console.log(this, 'change', this.entry);
      return this.entry.save();
    };

    EntryStateOption.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    };

    EntryStateOption.prototype.initialize = function(options) {
      return this.entry = options.entry;
    };

    return EntryStateOption;

  })(Backbone.View);

  MM.Views.URLEntry = (function(_super) {

    __extends(URLEntry, _super);

    function URLEntry() {
      URLEntry.__super__.constructor.apply(this, arguments);
    }

    URLEntry.prototype.template = _.template('<a href="<%= url %>"></a>');

    return URLEntry;

  })(MM.Views.Entry);

}).call(this);
