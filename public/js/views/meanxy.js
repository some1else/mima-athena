(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.Views || (MM.Views = {});

  MM.Views.MeanXY = (function(_super) {

    __extends(MeanXY, _super);

    function MeanXY() {
      this.render = __bind(this.render, this);
      MeanXY.__super__.constructor.apply(this, arguments);
    }

    MeanXY.prototype.template = _.template("");

    MeanXY.prototype.id = 'views-meanxy';

    MeanXY.prototype.initialize = function() {
      var concepts, queries;
      queries = new MM.MeanXY.Queries();
      this.breadcrumbs = new MM.MeanXY.Views.Breadcrumbs({
        collection: queries
      });
      concepts = new MM.MeanXY.Concepts({
        queries: queries
      });
      this.tiles = new MM.MeanXY.Views.Tiles({
        queries: queries,
        collection: concepts
      });
      return console.log(this, "#init");
    };

    MeanXY.prototype.render = function() {
      this.$el.html(this.template());
      this.$el.append(this.breadcrumbs.render().el);
      this.$el.append(this.tiles.render().el);
      console.log(this, "#render");
      return this;
    };

    return MeanXY;

  })(Backbone.View);

}).call(this);
