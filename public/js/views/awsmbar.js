(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.MM || (window.MM = {});

  MM.Views || (MM.Views = {});

  (_base = MM.Views).AwsmBar || (_base.AwsmBar = {});

  MM.Views.AwsmBar = (function(_super) {

    __extends(AwsmBar, _super);

    function AwsmBar() {
      this.onRendered = __bind(this.onRendered, this);
      this.render = __bind(this.render, this);
      this.onFuzzChange = __bind(this.onFuzzChange, this);
      AwsmBar.__super__.constructor.apply(this, arguments);
    }

    AwsmBar.prototype.model = MM.Entry;

    AwsmBar.prototype.template = _.template("");

    AwsmBar.prototype.className = 'awsmbar';

    AwsmBar.prototype.createEntry = function(entry) {
      this.entries.create(entry);
      this.buildNewModel();
      this.createSubViews(this.model);
      this.render();
      return this.onRendered();
    };

    AwsmBar.prototype.buildNewModel = function() {
      this.agenda.unBindEntriesSearch(this.model);
      this.model = new MM.Entry({
        fuzz: ''
      });
      return this.agenda.bindEntriesSearch(this.model);
    };

    AwsmBar.prototype.onFuzzChange = function(model, fuzz) {
      var fuzzContent;
      console.log(this, '#fetchConcepts', model, fuzz);
      fuzzContent = fuzz.replace(/^(\n|\r|\t)+$/, '');
      if (fuzzContent !== '') {
        this.model.fetchRelevantConcepts();
        return this.model.fetchSuggestedConcepts();
      } else {
        this.model.resetRelevantConcepts();
        return this.model.resetSuggestedConcepts();
      }
    };

    AwsmBar.prototype.createSubViews = function(model) {
      this.fuzz = new MM.Views.AwsmBar.Fuzz({
        model: model,
        awsmbar: this
      });
      this.relevant = new MM.Views.AwsmBar.RelevantConcepts({
        collection: model.relevantConcepts,
        awsmbar: this
      });
      return this.suggested = new MM.Views.AwsmBar.SuggestedConcepts({
        collection: model.suggestedConcepts,
        awsmbar: this
      });
    };

    AwsmBar.prototype.focus = function() {
      return this.fuzz.setCaret();
    };

    AwsmBar.prototype.getFuzz = function() {
      return this.model.get('fuzz');
    };

    AwsmBar.prototype.initialize = function(options) {
      this.entries = options.entries;
      this.agenda = options.agenda;
      this.createSubViews(this.model);
      return this.model.on('change:fuzz', this.onFuzzChange);
    };

    AwsmBar.prototype.render = function() {
      this.$el.html(this.template());
      this.$el.append(this.fuzz.render().el);
      this.$el.append(this.relevant.render().el);
      this.$el.append(this.suggested.render().el);
      return this;
    };

    AwsmBar.prototype.onRendered = function() {
      this.fuzz.onRendered();
      return this.focus();
    };

    return AwsmBar;

  })(Backbone.View);

  MM.Views.AwsmBar.RelevantConcept = (function(_super) {

    __extends(RelevantConcept, _super);

    function RelevantConcept() {
      this.render = __bind(this.render, this);
      this.appendToEntry = __bind(this.appendToEntry, this);
      RelevantConcept.__super__.constructor.apply(this, arguments);
    }

    RelevantConcept.prototype.template = _.template("<%= content %>");

    RelevantConcept.prototype.model = MM.Concept;

    RelevantConcept.prototype.tagName = 'li';

    RelevantConcept.prototype.events = {
      'click': 'appendToEntry'
    };

    RelevantConcept.prototype.appendToEntry = function() {
      this.entry.appendRelevantConcept(this.model);
      return this.model.trigger('relevantConceptAppended');
    };

    RelevantConcept.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.addClass(this.model.get('kind'));
      return this;
    };

    RelevantConcept.prototype.initialize = function(options) {
      this.model = options.model;
      return this.entry = options.entry;
    };

    return RelevantConcept;

  })(Backbone.View);

  MM.Views.AwsmBar.RelevantConcepts = (function(_super) {

    __extends(RelevantConcepts, _super);

    function RelevantConcepts() {
      this.render = __bind(this.render, this);
      this.reset = __bind(this.reset, this);
      this.add = __bind(this.add, this);
      RelevantConcepts.__super__.constructor.apply(this, arguments);
    }

    RelevantConcepts.prototype.template = _.template("");

    RelevantConcepts.prototype.tagName = 'ul';

    RelevantConcepts.prototype.className = 'relevant';

    RelevantConcepts.prototype.add = function(concept) {
      var view;
      view = new MM.Views.AwsmBar.RelevantConcept({
        model: concept,
        entry: this.entry
      });
      return this.$el.append(view.render().el);
    };

    RelevantConcepts.prototype.reset = function() {
      var concept, _i, _len, _ref, _results;
      this.render();
      _ref = this.collection.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        concept = _ref[_i];
        _results.push(this.add(concept));
      }
      return _results;
    };

    RelevantConcepts.prototype.render = function() {
      this.$el.html(this.template());
      return this;
    };

    RelevantConcepts.prototype.initialize = function(options) {
      this.awsmbar = options.awsmbar;
      this.entry = this.collection.entry;
      this.collection.on('add', this.add);
      return this.collection.on('reset', this.reset);
    };

    return RelevantConcepts;

  })(Backbone.View);

  MM.Views.AwsmBar.SuggestedConcepts = (function() {

    function SuggestedConcepts() {
      this.render = __bind(this.render, this);
      this.autoCompleteEntry = __bind(this.autoCompleteEntry, this);
    }

    SuggestedConcepts.prototype.template = _.template("<%= content %>");

    SuggestedConcepts.prototype.model = MM.Concept;

    SuggestedConcepts.prototype.tagName = 'li';

    SuggestedConcepts.prototype.events = {
      'click': 'autoCompleteEntry'
    };

    SuggestedConcepts.prototype.autoCompleteEntry = function() {
      this.entry.autoCompleteWith(this.model);
      return this.model.trigger('suggestedConceptCompleted');
    };

    SuggestedConcepts.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.addClass(this.model.get('kind'));
      return this;
    };

    SuggestedConcepts.prototype.initialize = function(options) {
      this.model = options.model;
      return this.entry = options.entry;
    };

    return SuggestedConcepts;

  })();

  MM.Views.AwsmBar.SuggestedConcepts = (function(_super) {

    __extends(SuggestedConcepts, _super);

    function SuggestedConcepts() {
      this.render = __bind(this.render, this);
      this.reset = __bind(this.reset, this);
      this.add = __bind(this.add, this);
      SuggestedConcepts.__super__.constructor.apply(this, arguments);
    }

    SuggestedConcepts.prototype.template = _.template("");

    SuggestedConcepts.prototype.tagName = 'ul';

    SuggestedConcepts.prototype.className = 'suggested';

    SuggestedConcepts.prototype.add = function(concept) {
      var view;
      view = new MM.Views.AwsmBar.SuggestedConcept({
        model: concept,
        entry: this.entry
      });
      return this.$el.append(view.render().el);
    };

    SuggestedConcepts.prototype.reset = function() {
      var concept, _i, _len, _ref;
      this.render();
      _ref = this.collection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        concept = _ref[_i];
        this.add(concept);
      }
      return console.log(this, '#reset', this.$el);
    };

    SuggestedConcepts.prototype.render = function() {
      var offsets;
      this.$el.html(this.template());
      offsets = this.fuzz.getAutoCompleteOffsets();
      console.log(this, '#render', this.$el);
      this.$el.get(0).style.top = offsets.x;
      this.$el.get(0).style.left = offsets.y;
      return this;
    };

    SuggestedConcepts.prototype.initialize = function(options) {
      this.awsmbar = options.awsmbar;
      this.entry = this.collection.entry;
      this.fuzz = this.awsmbar.fuzz;
      this.collection.on('add', this.add);
      return this.collection.on('reset', this.reset);
    };

    return SuggestedConcepts;

  })(Backbone.View);

  MM.Views.AwsmBar.Fuzz = (function(_super) {

    __extends(Fuzz, _super);

    function Fuzz() {
      this.onRendered = __bind(this.onRendered, this);
      this.render = __bind(this.render, this);
      this.focusArea = __bind(this.focusArea, this);
      this.onClear = __bind(this.onClear, this);
      this.onRelevantConceptAppended = __bind(this.onRelevantConceptAppended, this);
      this.onMouseUp = __bind(this.onMouseUp, this);
      this.onKeyUp = __bind(this.onKeyUp, this);
      this.onKeyDown = __bind(this.onKeyDown, this);
      this.onBlur = __bind(this.onBlur, this);
      this.onFocus = __bind(this.onFocus, this);
      Fuzz.__super__.constructor.apply(this, arguments);
    }

    Fuzz.prototype.template = _.template("<form class='awsmbar-fuzz'><textarea rows='1' placeholder='search or create'><%= fuzz %></textarea></form>");

    Fuzz.prototype.events = {
      "keydown textarea": 'onKeyDown',
      "keyup textarea": 'onKeyUp',
      "mouseup textarea": 'onMouseUp',
      "focus textarea": 'onFocus',
      "blur textarea": 'onBlur'
    };

    Fuzz.prototype.onFocus = function() {
      return this.focused = 1;
    };

    Fuzz.prototype.onBlur = function() {
      this.focused = 0;
      return this.resizeArea();
    };

    Fuzz.prototype.insertTab = function() {
      this.model.set('fuzz', this.model.get('fuzz') + "\t");
      return this.area.val(this.area.val() + "\t");
    };

    Fuzz.prototype.onKeyDown = function(e) {
      var fuzz, k, lastFewCharacters;
      k = e.keyCode || e.charCode;
      switch (k) {
        case 9:
          if (e.shiftKey === false) {
            e.preventDefault();
            if (!this.autoCompletable()) return this.insertTab();
          }
          break;
        case 13:
          fuzz = this.model.get('fuzz');
          lastFewCharacters = fuzz.substr(fuzz.length - 1, fuzz.length) + '\n';
          if (lastFewCharacters === '\n\n') {
            e.preventDefault();
            return this.finishEditing();
          }
      }
    };

    Fuzz.prototype.onKeyUp = function(e) {
      this.model.set('fuzz', this.area.val());
      if (this.resizeRequired()) return this.resizeArea();
    };

    Fuzz.prototype.onMouseUp = function(e) {
      return this.clone.resize(this.area.width());
    };

    Fuzz.prototype.onRelevantConceptAppended = function() {
      var fuzz;
      fuzz = this.model.get('fuzz');
      this.area.val(fuzz + ' ');
      this.setCaret(fuzz.length + 1);
      return this.model.fetchRelevantConcepts();
    };

    Fuzz.prototype.onClear = function() {
      return this.area.val('');
    };

    Fuzz.prototype.setSelection = function(start, end) {
      var range, textarea;
      textarea = this.area.get(0);
      if (textarea.setSelectionRange) {
        textarea.focus();
        textarea.setSelectionRange(start, end);
      } else if (this.area.createTextRange) {
        range = textarea.createTextRange();
        range.collapse(true);
        range.moveEnd("character", end);
        range.moveStart("character", start);
        range.select();
      }
      return console.log(this, '#setSelection');
    };

    Fuzz.prototype.setCaret = function(pos) {
      pos || (pos = this.model.get('fuzz').length);
      return this.setSelection(pos, pos);
    };

    Fuzz.prototype.resizeArea = function() {
      var newHeight;
      newHeight = this.clone.$el.height();
      if (this.model.get('fuzz').length > 0 || this.focused) {
        newHeight += this.lineHeight;
      }
      return this.area.height(newHeight);
    };

    Fuzz.prototype.resizeRequired = function() {
      var probably;
      probably = false;
      if (this.area.height() !== this.clone.height() + (this.lineHeight * this.focused)) {
        probably = true;
      }
      return probably;
    };

    Fuzz.prototype.autoCompletable = function() {
      var actually;
      actually = false;
      if (false) actually = true;
      return actually;
    };

    Fuzz.prototype.focusArea = function() {
      console.log(this, '#focusArea');
      return this.area.get(0).focus();
    };

    Fuzz.prototype.getAutoCompleteOffsets = function() {
      return this.clone.getAutoCompleteOffsets();
    };

    Fuzz.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.area = this.$('textarea');
      this.$clone = this.clone.render().el;
      this.$el.append(this.$clone);
      return this;
    };

    Fuzz.prototype.onRendered = function() {
      this.lineHeight = this.area.css('lineHeight');
      this.lineHeight = parseInt(this.lineHeight.substr(0, this.lineHeight.indexOf('px')));
      this.clone.onRendered();
      return this.resizeArea();
    };

    Fuzz.prototype.finishEditing = function() {
      this.awsmbar.createEntry(this.model);
      this.area.blur();
      return this.onBlur();
    };

    Fuzz.prototype.initialize = function(options) {
      this.awsmbar = options.awsmbar;
      this.focused = 0;
      this.clone = new MM.Views.AwsmBar.Fuzz.Clone({
        role_model: this,
        model: this.model
      });
      return this.model.on('relevantConceptAppended', this.onRelevantConceptAppended);
    };

    return Fuzz;

  })(Backbone.View);

  MM.Views.AwsmBar.Fuzz.Clone = (function(_super) {

    __extends(Clone, _super);

    function Clone() {
      this.onRendered = __bind(this.onRendered, this);
      this.render = __bind(this.render, this);
      this.parrot = __bind(this.parrot, this);
      this.impersonate = __bind(this.impersonate, this);
      Clone.__super__.constructor.apply(this, arguments);
    }

    Clone.prototype.template = _.template("<span><%= fuzz %></span>");

    Clone.prototype.className = 'awsmbar-clone';

    Clone.prototype.traits = ['lineHeight', 'textDecoration', 'letterSpacing', 'fontSize', 'fontFamily', 'fontStyle', 'fontWeight', 'textRendering', 'textTransform', 'textAlign', 'direction', 'wordSpacing', 'fontSizeAdjust', 'paddingTop', 'paddingLeft', 'paddingBottom', 'paddingRight', 'width', 'whiteSpace', 'textIndent'];

    Clone.prototype.height = function() {
      return this.$el.height();
    };

    Clone.prototype.impersonate = function() {
      var trait, _i, _len, _ref, _results;
      console.log(this, '#impersonate', this.role_model);
      _ref = this.traits;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        trait = _ref[_i];
        _results.push(this.el.style[trait] = this.role_model.area.css(trait));
      }
      return _results;
    };

    Clone.prototype.last_word = function(sentence) {
      return sentence.substr(sentence.lastIndexOf(' '), sentence.length);
    };

    Clone.prototype.subdivide = function($pan) {
      var $br, $s, carry, content, last_word_start, length;
      if ($pan.height() > this.lineHeight) {
        carry = '';
        while ($pan.height() > this.lineHeight) {
          content = $pan.html();
          length = content.length;
          if ((last_word_start = content.lastIndexOf(' ')) > -1) {
            carry = content.substr(last_word_start, length) + carry;
            content = content.substr(0, last_word_start);
          } else {
            carry = content.substr(content.length - 1, content.length);
            content = content.substr(0, content.length - 1);
          }
          $pan.text(content);
        }
        $br = $("<br>").insertAfter($pan);
        $s = $("<span>" + carry + "</span>").insertAfter($br);
        return this.subdivide($s);
      } else if ($pan.text() === '') {
        return $pan.text('&nbsp;');
      }
    };

    Clone.prototype.parrot = function() {
      var fuzz;
      fuzz = this.model.get('fuzz');
      fuzz = fuzz.split('\n');
      if (_(fuzz).last() === '') fuzz[fuzz.length - 1] = '&nbsp;';
      fuzz = '<span>' + fuzz.join('</span><br><span>') + '</span>';
      return this.$el.html(fuzz);
    };

    Clone.prototype.resize = function(width) {
      this.$el.width(width);
      return this.role_model.resizeArea();
    };

    Clone.prototype.getAutoCompleteOffsets = function() {
      var $lastSpan, offset;
      $lastSpan = this.$('span').last();
      offset = $lastSpan.offset();
      console.log(this, '#getAutoCompleteOffsets', offset);
      offset = {
        left: offset.left + $lastSpan.width(),
        top: offset.top + $lastSpan.height()
      };
      return offset;
    };

    Clone.prototype.render = function() {
      this.$el.html(this.template(this.role_model.model.toJSON()));
      return this;
    };

    Clone.prototype.onRendered = function() {
      return this.impersonate();
    };

    Clone.prototype.initialize = function(options) {
      this.role_model = options.role_model;
      return this.model.bind('change', this.parrot);
    };

    return Clone;

  })(Backbone.View);

}).call(this);
