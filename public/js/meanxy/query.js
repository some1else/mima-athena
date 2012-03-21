(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.MeanXY || (MM.MeanXY = {});

  MM.MeanXY.QueryModel = (function(_super) {

    __extends(QueryModel, _super);

    function QueryModel() {
      QueryModel.__super__.constructor.apply(this, arguments);
    }

    QueryModel.prototype.defaults = {
      x: false,
      y: false
    };

    return QueryModel;

  })(Backbone.Model);

  MM.MeanXY.QueryCollection = (function(_super) {

    __extends(QueryCollection, _super);

    function QueryCollection() {
      QueryCollection.__super__.constructor.apply(this, arguments);
    }

    QueryCollection.prototype.model = MM.MeanXY.QueryModel;

    QueryCollection.prototype.toString = function(delimiter) {
      var models, res;
      res = "";
      models = _(this.models).reject(function(m) {
        return m.get("query") === true;
      });
      $.each(models, function(i, m) {
        res += m.toString();
        if (i < models.length - 1) return res += delimiter;
      });
      return res;
    };

    QueryCollection.prototype.asQueryParam = function() {
      return this.toString(",");
    };

    QueryCollection.prototype.asFuzztleText = function() {
      return this.toString(" ");
    };

    QueryCollection.prototype.xyPos = function() {
      var m, result;
      result = {
        x: Math.ceil(columns / 2),
        y: Math.floor(rows / 2)
      };
      if (!_.isEmpty(this.models)) {
        m = this.models[this.models.length - 1];
        result = {
          x: m.get("x"),
          y: m.get("y")
        };
      }
      return result;
    };

    return QueryCollection;

  })(Backbone.Collection);

}).call(this);
