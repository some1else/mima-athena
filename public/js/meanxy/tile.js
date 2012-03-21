(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.MeanXY || (MM.MeanXY = {});

  MM.MeanXY.TileView = (function(_super) {

    __extends(TileView, _super);

    function TileView() {
      TileView.__super__.constructor.apply(this, arguments);
    }

    TileView.prototype.events = {
      "click a": "query"
    };

    TileView.prototype.render = function() {
      $(this.el).html(this.template(this.model.attributes));
      return this;
    };

    return TileView;

  })(Backbone.View);

  MM.MeanXY.TileLabelView = (function(_super) {

    __extends(TileLabelView, _super);

    function TileLabelView() {
      TileLabelView.__super__.constructor.apply(this, arguments);
    }

    TileLabelView.prototype.template = _.template("<li class='tile tile_x_<%= x %> tile_y_<%= y %> " + "tile_<%= kind %> tile_<%= kind %>_<%= shade %>'>" + "<a href='#'><span><%= content %>" + "</span><em><%= Math.round(weight * 10) / 10 %></em></a></li>");

    TileLabelView.prototype.query = function(e) {
      doQuery(this.model);
      return e.preventDefault();
    };

    TileLabelView.prototype.initialize = function() {
      return _.bindAll(this, "render");
    };

    return TileLabelView;

  })(MM.MeanXY.TileView);

  MM.MeanXY.TileQueryView = (function(_super) {

    __extends(TileQueryView, _super);

    function TileQueryView() {
      TileQueryView.__super__.constructor.apply(this, arguments);
    }

    TileQueryView.prototype.template = _.template("<li class='tile tile_x_<%= x %> tile_y_<%= y %> " + "query_<%= kind %>'><a href='#'><span>" + "<%= content %></span></a></li>");

    TileQueryView.prototype.query = function(e) {
      doTypeQuery(this.model);
      return e.preventDefault();
    };

    return TileQueryView;

  })(MM.MeanXY.TileView);

  MM.MeanXY.TileKnotView = (function(_super) {

    __extends(TileKnotView, _super);

    function TileKnotView() {
      TileKnotView.__super__.constructor.apply(this, arguments);
    }

    TileKnotView.prototype.template = _.template("<li class='tile tile_x_<%= x %> tile_y_<%= y %> " + "query_<%= kind %>'><a href='#'><span>" + "<%= content %></span></a></li>");

    TileKnotView.prototype.query = function(e) {
      doKnotQuery();
      return e.preventDefault();
    };

    return TileKnotView;

  })(MM.MeanXY.TileView);

  MM.MeanXY.TileCollectionView = (function(_super) {

    __extends(TileCollectionView, _super);

    function TileCollectionView() {
      TileCollectionView.__super__.constructor.apply(this, arguments);
    }

    TileCollectionView.prototype.el = "#app";

    TileCollectionView.prototype.grid = [];

    TileCollectionView.prototype.initialize = function() {
      _.bindAll(this, "addOne", "addAll");
      Tiles.bind("add", this.addOne, this);
      Tiles.bind("reset", this.reset, this);
      return this.grid = [];
    };

    TileCollectionView.prototype.addOne = function(tile) {
      var view;
      view = void 0;
      if (tile.get("query") === true) {
        if (tile.get("kind").toUpperCase() === "KNOT") {
          view = new MM.MeanXY.TileKnotView({
            model: tile
          });
        } else {
          view = new MM.MeanXY.TileQueryView({
            model: tile
          });
        }
      } else {
        view = new MM.MeanXY.TileLabelView({
          model: tile
        });
      }
      return this.$("#tiles").append(view.render().el);
    };

    TileCollectionView.prototype.addTiles = function() {
      return Tiles.each(this.addOne);
    };

    TileCollectionView.prototype.applyShade = function() {
      var delta, max, min;
      max = 0;
      min = 9007199254740992;
      Tiles.each(function(tile) {
        var tw;
        tw = tile.get("weight");
        if (_.isString(tw)) {
          tw = parseFloat(tw);
          if (tw < min) min = tw;
          if (tw > max) return max = tw;
        }
      });
      delta = max - min;
      return Tiles.each(function(tile) {
        var dif, tw, val;
        tw = tile.get("weight");
        if (_.isString(tw)) {
          tw = parseFloat(tw);
          dif = tw - min;
          val = dif / (delta / 5);
          val = Math.abs(5 - Math.round(val));
          return tile.set({
            shade: val
          }, {
            silent: true
          });
        }
      });
    };

    TileCollectionView.prototype.drawGrid = function() {
      var col, row, _results;
      this.grid = [];
      col = 0;
      _results = [];
      while (col < columns) {
        this.grid[col] = [];
        row = 0;
        while (row < rows) {
          if (_.detect(Tiles.models, function(m) {
            return (m.get("x") === col) && (m.get("y") === row);
          })) {
            this.grid[col][row] = true;
          } else {
            this.grid[col][row] = false;
          }
          row++;
        }
        _results.push(col++);
      }
      return _results;
    };

    TileCollectionView.prototype.spiralWalk = function(pos) {
      var all_tiles, bounds, buffer, di, dj, i, j, k, p, positioned_count, segment_length, segment_passed, _results;
      if (pos.x < (columns - 1) / 2) {
        di = 1;
      } else {
        di = -1;
      }
      dj = 0;
      segment_length = 1;
      i = 0;
      j = 0;
      segment_passed = 0;
      all_tiles = _.reject(Tiles.models, function(t) {
        return (t.get("query") === true) || (t.get("prompt") === true);
      });
      positioned_count = 0;
      bounds = {
        x: {
          min: 0,
          max: columns - 1
        },
        y: {
          min: 0,
          max: rows - 1
        }
      };
      k = 0;
      _results = [];
      while ((k < (columns * 8 * rows * 8)) && (positioned_count < all_tiles.length)) {
        p = {
          x: i + pos.x,
          y: j + pos.y
        };
        if ((p.x >= bounds.x.min) && (p.x <= bounds.x.max) && (p.y >= bounds.y.min) && (p.y <= bounds.y.max)) {
          if (this.grid[p.x][p.y] === false) {
            all_tiles[positioned_count].set({
              x: p.x,
              y: p.y
            }, {
              silent: true
            });
            this.grid[p.x][p.y] = true;
            positioned_count++;
          }
        }
        i += di;
        j += dj;
        ++segment_passed;
        if (segment_passed === segment_length) {
          segment_passed = 0;
          if ((pos.x < (columns - 1) / 2) && (pos.y > (rows - 1) / 2) || (pos.x > (columns - 1) / 2) && (pos.y < (rows - 1) / 2)) {
            buffer = dj;
            dj = -di;
            di = buffer;
          } else {
            buffer = di;
            di = -dj;
            dj = buffer;
          }
          if (dj === 0) ++segment_length;
        }
        _results.push(++k);
      }
      return _results;
    };

    TileCollectionView.prototype.addAll = function() {
      this.drawGrid();
      if (Queries.xyPos().x !== false) this.spiralWalk(Queries.xyPos());
      this.applyShade();
      return this.addTiles();
    };

    TileCollectionView.prototype.reset = function() {
      this.$("#tiles").empty();
      return this.addAll();
    };

    return TileCollectionView;

  })(Backbone.View);

}).call(this);
