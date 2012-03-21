(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  MM.Workflow = (function(_super) {

    __extends(Workflow, _super);

    function Workflow() {
      Workflow.__super__.constructor.apply(this, arguments);
    }

    Workflow.prototype["default"] = {
      id: '',
      label: ''
    };

    Workflow.prototype.parse = function(values) {
      return values;
    };

    Workflow.prototype.buildStates = function() {
      var state, _i, _len, _ref, _results;
      this.states = [];
      _ref = this.get('states');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        state = _ref[_i];
        _results.push(this.states.push(new MM.WorkflowState(state)));
      }
      return _results;
    };

    Workflow.prototype.initialize = function() {
      this.buildStates();
      return console.log(this, '#init', this.get('label'));
    };

    return Workflow;

  })(Backbone.Model);

  MM.Workflows || (MM.Workflows = {});

  MM.Workflows = (function(_super) {

    __extends(Workflows, _super);

    function Workflows() {
      Workflows.__super__.constructor.apply(this, arguments);
    }

    Workflows.prototype.model = MM.Workflow;

    Workflows.prototype.sync = MM.Sync.StubbedWorkflows;

    Workflows.prototype.parse = function(response) {
      var key_id, key_workflowLabel, results, value_states, value_workflow, workflow, _ref;
      results = [];
      if (_.isObject(response.workflow)) {
        _ref = response.workflow;
        for (key_id in _ref) {
          value_workflow = _ref[key_id];
          if (!(_.isObject(value_workflow))) continue;
          workflow = {};
          workflow.id = key_id;
          workflow.label = 'uninitialized';
          workflow.states = [];
          for (key_workflowLabel in value_workflow) {
            value_states = value_workflow[key_workflowLabel];
            if (!(workflow.label === 'uninitialized')) continue;
            workflow.label = key_workflowLabel;
            workflow.states = value_states;
          }
          results.push(workflow);
        }
      }
      console.log(this, '#parse', response, results);
      return results;
    };

    Workflows.prototype.url = function() {
      var base, login;
      base = MM.Sync.URL;
      login = MM.session.get('account');
      return "" + base + "/appdata/" + login;
    };

    Workflows.prototype.initialize = function() {
      return console.log(this, '#init', 'LOL');
    };

    return Workflows;

  })(Backbone.Collection);

  MM.WorkflowState = (function(_super) {

    __extends(WorkflowState, _super);

    function WorkflowState() {
      WorkflowState.__super__.constructor.apply(this, arguments);
    }

    WorkflowState.prototype.defaults = {
      fg_id: '',
      label: ''
    };

    WorkflowState.prototype.parse = function(values) {
      return {
        fg_id: values.fg,
        label: values.name
      };
    };

    WorkflowState.prototype.initialize = function(state) {
      this.clear();
      this.set(this.parse(state));
      return console.log(this, '#init', this.get('label'));
    };

    return WorkflowState;

  })(Backbone.Model);

}).call(this);
