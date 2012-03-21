(function() {
  var columns, doKnotQuery, doQuery, doTypeQuery, jax, knot, launchpad, resetSession, rows, _base,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  (_base = window.MM).MeanXY || (_base.MeanXY = {});

  columns = 5;

  rows = 3;

  knot = {
    type: "knot query",
    label: "§"
  };

  launchpad = {
    entities: [
      {
        type: "person query",
        label: "+",
        x: 0,
        y: 1
      }, {
        type: "delegate_in query",
        label: "<",
        x: 0,
        y: 0
      }, {
        type: "delegate_out query",
        label: ">",
        x: 1,
        y: 0
      }, {
        type: "tag query",
        label: "#",
        x: columns - 1,
        y: 0
      }, {
        type: "place query",
        label: "@",
        x: 2,
        y: rows - 1
      }, {
        type: "time query",
        label: "~",
        x: columns - 2,
        y: rows - 2
      }, {
        type: "knot query",
        label: "§",
        x: columns - 1,
        y: rows - 1
      }
    ]
  };

  MM.MeanXY.EntryModel = (function(_super) {

    __extends(EntryModel, _super);

    function EntryModel() {
      EntryModel.__super__.constructor.apply(this, arguments);
    }

    EntryModel.prototype.defaults = {
      'text': "...",
      description: "...",
      prettytime: "now",
      url: "#"
    };

    EntryModel.prototype.parse = function(om) {
      om = {
        text: om.text,
        description: om.description,
        prettytime: om.prettytimecreated,
        url: om.url
      };
      return om;
    };

    EntryModel.prototype.initialize = function(obj) {
      return this.set(this.parse(obj));
    };

    return EntryModel;

  })(Backbone.Model);

  MM.MeanXY.EntryCollection = (function(_super) {

    __extends(EntryCollection, _super);

    function EntryCollection() {
      EntryCollection.__super__.constructor.apply(this, arguments);
    }

    EntryCollection.prototype.model = MM.MeanXY.EntryModel;

    return EntryCollection;

  })(Backbone.Collection);

  MM.MeanXY.EntryView = (function(_super) {

    __extends(EntryView, _super);

    function EntryView() {
      EntryView.__super__.constructor.apply(this, arguments);
    }

    EntryView.prototype.template = _.template("<div class='entry'>" + "<h1><a href='<%= url %>'><%= text %></a></h1>" + "<p><%= description %>(<em><%= prettytime %></em>)</p>" + "</div>");

    EntryView.prototype.render = function() {
      $(this.el).html(this.template(this.model.attributes));
      return this;
    };

    return EntryView;

  })(Backbone.View);

  MM.MeanXY.EntryCollectionView = (function(_super) {

    __extends(EntryCollectionView, _super);

    function EntryCollectionView() {
      EntryCollectionView.__super__.constructor.apply(this, arguments);
    }

    EntryCollectionView.prototype.el = "#entries";

    EntryCollectionView.prototype.reset = function() {
      $("#entries").empty();
      return Entries.each(function(entry) {
        var view;
        view = new MM.MeanXY.EntryView({
          model: entry
        });
        return $("#entries").append(view.render().el);
      });
    };

    EntryCollectionView.prototype.initialize = function() {
      _.bindAll(this, "reset");
      return Entries.bind("reset", this.reset, this);
    };

    return EntryCollectionView;

  })(Backbone.View);

  jax = function(path, data, silent) {
    var dt, url;
    if (window.TOKEN === undefined) {
      data.secret = "admin123";
    } else {
      data.access_token = window.TOKEN;
    }
    dt = "";
    if (silent !== true) {
      dt = "jsonp";
      if (path === "relevant") {
        data.json_callback = "_relevant_jsonp";
      } else if (path === "knot") {
        path = "entry";
        data.json_callback = "_knot_jsonp";
      } else if (path === "entries") {
        data.json_callback = "_entries_jsonp";
      } else if (path === "type") {
        data.json_callback = "_type_jsonp";
        path = "relevant";
      }
    } else {
      dt = "json";
    }
    url = "http://" + server + "/BTW/" + path + "/" + user;
    return $.ajax(url, {
      dataType: dt,
      data: data
    });
  };

  doQuery = function(model) {
    var data;
    if (model) Queries.add(model);
    data = {
      q: Queries.asQueryParam()
    };
    data.limit = columns * rows;
    return jax("relevant", data);
  };

  window._relevant_jsonp = function(response) {
    var resp;
    if (response.error) {
      resp = [];
    } else {
      resp = response.entities.slice(0, columns * rows - launchpad.entities.length);
    }
    resp = resp.concat(launchpad.entities);
    Tiles.reset(resp);
    return $("#meta").html(response.meta);
  };

  doTypeQuery = function(model) {
    var data, qs;
    Queries.add(model);
    data = {
      type: model.get("kind").toUpperCase(),
      limit: columns * rows
    };
    qs = Queries.asQueryParam();
    data.q = (qs.length > 0 ? qs : undefined);
    return jax("type", data);
  };

  window._type_jsonp = function(response) {
    var entities;
    entities = void 0;
    if (response.error) {
      entities = launchpad;
    } else {
      entities = response.entities.slice(0, columns * rows);
    }
    return Tiles.reset(entities);
  };

  doKnotQuery = function() {
    var data;
    data = {
      add: Queries.asFuzztleText()
    };
    return jax("knot", data);
  };

  window._knot_jsonp = function(response) {
    Queries.reset();
    return doQuery();
  };

  resetSession = function() {
    var data;
    Queries.reset();
    data = {
      reset: "true"
    };
    jax("relevant", data);
    return Tiles.reset(static_launchpad.entities);
  };

  $("#reset").click(function(e) {
    return resetSession();
  });

  MM.MeanXY.factory = function() {
    var BreadcrumbsView, Entries, EntriesView, Queries, Tiles, TilesView;
    Queries = new MM.MeanXY.QueryCollection();
    BreadcrumbsView = new MM.MeanXY.BreadcrumbCollectionView();
    Tiles = new MM.MeanXY.TileCollection();
    TilesView = new MM.MeanXY.TileCollectionView();
    Entries = new MM.MeanXY.EntryCollection();
    EntriesView = new MM.MeanXY.EntryCollectionView();
    return doQuery();
  };

}).call(this);
