(function() {
  MM;
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.Concept = (function(_super) {

    __extends(Concept, _super);

    function Concept() {
      Concept.__super__.constructor.apply(this, arguments);
    }

    Concept.prototype.defaults = {
      content: "",
      kind: "",
      weight: 0,
      shade: 0,
      x: false,
      y: false,
      query: false,
      prompt: false
    };

    Concept.prototype.parse = function(values) {
      var i, result, typ;
      result = {};
      typ = values.type;
      i = typ.indexOf(" ");
      if (i > 0) {
        if (typ.indexOf("query") > 0) result.query = true;
        if (typ.indexOf("prompt") > 0) result.prompt = true;
        typ = typ.substr(0, i);
      }
      switch (typ.toUpperCase()) {
        case "TAG":
          result.kind = "tag";
          break;
        case "PERSON":
          result.kind = "person";
          break;
        case "DELEGATE_IN":
          result.kind = "delegate_in";
          break;
        case "DELEGATE_OUT":
          result.kind = "delegate_out";
          break;
        case "PLACE":
          result.kind = "place";
          break;
        case "TIME":
          result.kind = "time";
          break;
        case "KNOT":
          result.kind = "knot";
          break;
        default:
          result.kind = "tile";
      }
      result.content = values.label;
      if (_.isString(values.w) || _.isNumber(values.w)) {
        result.weight = values.w;
      } else if (result.kind === "knot") {
        result.weight = -Infinity;
      } else {
        result.weight = 0;
      }
      return result;
    };

    Concept.prototype.toString = function() {
      var res;
      res = "";
      switch (this.get("kind").toUpperCase()) {
        case "PERSON":
          res += "+";
          break;
        case "TAG":
          res += "#";
          break;
        case "PLACE":
          res += "@";
          break;
        case "TIME":
          res += "~";
      }
      res += this.get("content");
      return res;
    };

    return Concept;

  })(Backbone.Model);

  MM.Person = (function(_super) {

    __extends(Person, _super);

    function Person() {
      Person.__super__.constructor.apply(this, arguments);
    }

    Person.prototype.defaults = {
      name: "John Doe",
      kind: "person",
      score: {
        weight: 0,
        shade: 0
      }
    };

    return Person;

  })(MM.Concept);

}).call(this);
