(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.MeanXY || (MM.MeanXY = {});

  MM.MeanXY.BreadcrumbView = (function(_super) {

    __extends(BreadcrumbView, _super);

    function BreadcrumbView() {
      BreadcrumbView.__super__.constructor.apply(this, arguments);
    }

    BreadcrumbView.prototype.tagName = "span";

    BreadcrumbView.prototype.events = {
      click: "removeQuery"
    };

    BreadcrumbView.prototype.template = _.template("<span class='breadcrumb_tile breadcrumb_<%= kind %>'><%= content %></span>");

    BreadcrumbView.prototype.render = function() {
      if (this.model.get("kind").indexOf("query") === -1) {
        $(this.el).html(this.template(this.model.attributes));
      }
      return this;
    };

    BreadcrumbView.prototype.removeQuery = function() {
      Queries.remove([this.model]);
      return doQuery();
    };

    return BreadcrumbView;

  })(Backbone.View);

  MM.MeanXY.BreadcrumbCollectionView = (function(_super) {

    __extends(BreadcrumbCollectionView, _super);

    function BreadcrumbCollectionView() {
      BreadcrumbCollectionView.__super__.constructor.apply(this, arguments);
    }

    BreadcrumbCollectionView.prototype.el = "#breadcrumbs";

    BreadcrumbCollectionView.prototype.initialize = function() {
      _.bindAll(this, "addOne");
      Queries.bind("add", this.addOne, this);
      Queries.bind("reset", this.reset, this);
      return Queries.bind("remove", this.addAll, this);
    };

    BreadcrumbCollectionView.prototype.addAll = function() {
      var dis;
      this.reset();
      dis = this;
      return Queries.each(function(query) {
        return dis.addOne(query);
      });
    };

    BreadcrumbCollectionView.prototype.addOne = function(query) {
      var view;
      if (query.get("query") !== true) {
        view = new MM.MeanXY.BreadcrumbView({
          model: query
        });
        return $(this.el).append(view.render().el);
      }
    };

    BreadcrumbCollectionView.prototype.reset = function() {
      return $(this.el).html("");
    };

    return BreadcrumbCollectionView;

  })(Backbone.View);

}).call(this);
