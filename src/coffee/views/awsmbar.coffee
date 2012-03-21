# # AwsmBar
#
# `AwsmBar` lets the user (identified with `Session`) edit an `Entry` or filter existing `Entries`
#
# When a user begins to create an `Entry` or filtering `Entries`, it displays related `Concepts` as `RelevantConcepts` (stored in `@relevant`) and offers to auto-complete `Concepts` as `SuggestedConcepts` (stored in `@suggestions`)

window.MM ||= {}
MM.Views ||= {}
MM.Views.AwsmBar ||= {}

class MM.Views.AwsmBar extends Backbone.View
  model: MM.Entry
  template: _.template("")
  className: 'awsmbar'

  # When `Fuzz` view wants to persist the current `Entry`, we send it over to `@collection`, reinstantiate the `@model` and sub-views (`RelevantConcepts`, `SuggestedConcepts`) and re-`render` the `AwsmBar`
  createEntry: (entry) ->
    @entries.create(entry)   
    
    @buildNewModel()
    @createSubViews(@model)

    @render()
    @onRendered()

  buildNewModel: () ->
    @agenda.unBindEntriesSearch(@model)
    @model = new MM.Entry(fuzz: '')
    @agenda.bindEntriesSearch(@model)

  onFuzzChange: (model, fuzz) =>
    console.log @, '#fetchConcepts', model, fuzz
    # Make sure any beginning and trailing newlines and tabs are removed
    fuzzContent = fuzz.replace(/^(\n|\r|\t)+$/, '')
    # Fetch relevant concepts unless we're dealing with an empty fuzz
    if fuzzContent isnt ''
      @model.fetchRelevantConcepts()
      @model.fetchSuggestedConcepts()
    else
      @model.resetRelevantConcepts()
      @model.resetSuggestedConcepts()

    # @askForSuggestion if @autoCompletable()

  createSubViews: (model) ->
    @fuzz = new MM.Views.AwsmBar.Fuzz model: model, awsmbar: @
    @relevant = new MM.Views.AwsmBar.RelevantConcepts collection: model.relevantConcepts, awsmbar: @
    @suggested =  new MM.Views.AwsmBar.SuggestedConcepts collection: model.suggestedConcepts, awsmbar: @

  focus: ->
    @fuzz.setCaret()

  getFuzz: ->
    @model.get('fuzz')

  initialize: (options) ->
    @entries = options.entries
    @agenda = options.agenda
    @createSubViews(@model)
    @model.on 'change:fuzz', @onFuzzChange
    

  render: =>
    @$el.html @template()
    @$el.append @fuzz.render().el
    @$el.append @relevant.render().el
    @$el.append @suggested.render().el
    @

  onRendered: =>
    @fuzz.onRendered()
    @focus()

# ## Relevant Concept View
# An individual `Concept` that relates to `Awsmbar`'s `Entry`. If clicked, it should append itself to the `Entry.fuzz` attribute
class MM.Views.AwsmBar.RelevantConcept extends Backbone.View
  template: _.template "<%= content %>"
  model: MM.Concept
  tagName: 'li'

  events:
    'click': 'appendToEntry'

  appendToEntry: =>
    @entry.appendRelevantConcept(@model)
    @model.trigger 'relevantConceptAppended'


  render: =>
    @$el.html @template(@model.toJSON())
    @$el.addClass @model.get('kind')
    @

  initialize: (options) ->
    @model = options.model
    @entry = options.entry

# ## Relevant Concept Collection
# A collection of relevant concepts
class MM.Views.AwsmBar.RelevantConcepts extends Backbone.View
  template: _.template ""
  tagName: 'ul', className: 'relevant'
  add: (concept) =>
    view = new MM.Views.AwsmBar.RelevantConcept(model: concept, entry: @entry)
    @$el.append view.render().el
  reset: =>
    @render()
    @add(concept) for concept in @collection.models
  render: =>
    @$el.html @template()
    @
  initialize: (options) ->
    @awsmbar = options.awsmbar
    @entry = @collection.entry
    @collection.on 'add', @add
    @collection.on 'reset', @reset

# ## Suggested Concept View
# An individual `Concept` that appears on the list of `SuggestedConcepts` for auto-completion of the last word
class MM.Views.AwsmBar.SuggestedConcepts
  template: _.template "<%= content %>"
  model: MM.Concept
  tagName: 'li'

  events:
    'click': 'autoCompleteEntry'

  autoCompleteEntry: =>
    @entry.autoCompleteWith(@model)
    @model.trigger 'suggestedConceptCompleted'

  render: =>
    @$el.html @template(@model.toJSON())
    @$el.addClass @model.get('kind')
    @

  initialize: (options) ->
    @model = options.model
    @entry = options.entry

# ## Suggested Concept Collection
# A collection of suggested `Concepts` appears as a list of auto-complete choices while the user is editing `Fuzz`.
# The 
class MM.Views.AwsmBar.SuggestedConcepts extends Backbone.View
  template: _.template ""
  tagName: 'ul', className: 'suggested'

  add: (concept) =>
    view = new MM.Views.AwsmBar.SuggestedConcept(model: concept, entry: @entry)
    @$el.append view.render().el

  reset: =>
    @render()
    @add(concept) for concept in @collection.models
    console.log @, '#reset', @$el

  render: =>
    @$el.html @template()
    offsets = @fuzz.getAutoCompleteOffsets()
    console.log @, '#render', @$el
    @$el.get(0).style.top = offsets.x
    @$el.get(0).style.left = offsets.y
    @

  initialize: (options) ->
    @awsmbar = options.awsmbar
    @entry = @collection.entry
    @fuzz = @awsmbar.fuzz
    @collection.on 'add', @add
    @collection.on 'reset', @reset
    
# ## Fuzz View
# Editing an Entry means speaking in Fuzztle
class MM.Views.AwsmBar.Fuzz extends Backbone.View
  template: _.template "<form class='awsmbar-fuzz'><textarea rows='1' placeholder='search or create'><%= fuzz %></textarea></form>"

  events:
    "keydown textarea"  : 'onKeyDown'
    "keyup textarea"    : 'onKeyUp'
    "mouseup textarea"  : 'onMouseUp'
    "focus textarea"    : 'onFocus'
    "blur textarea"     : 'onBlur'

  onFocus: =>
    @focused = 1

  onBlur: =>
    @focused = 0
    @resizeArea()

  # Insert a tab silently because we don't want to re-render if the user is focused
  insertTab: ->
    @model.set 'fuzz', @model.get('fuzz') + "\t"
    @area.val @area.val() + "\t"
  
  onKeyDown: (e) =>
    k = e.keyCode || e.charCode
    switch k
      # TAB
      when 9
        if e.shiftKey == false
          # if @autoCompletable()
          e.preventDefault()
          @insertTab() unless @autoCompletable()
          # HANDLE TAB by autocompleting
      # RETURN
      when 13
        fuzz = @model.get('fuzz')
        # The last key isn't in the model property yet, so we append it to the last character
        lastFewCharacters = fuzz.substr(fuzz.length - 1, fuzz.length) + '\n'
        # Finish editing if the last few characters were returns
        if lastFewCharacters == '\n\n'
          e.preventDefault()
          @finishEditing()

  # When typing is finished, `Entry` is updated, `@area` is resized, `RelevantConcepts` are fetched on the `@model`
  onKeyUp: (e) =>
    @model.set 'fuzz', @area.val()

    @resizeArea() if @resizeRequired()

  # Resize the `@clone` in case the user changes the width of textarea (permitted in most browsers)
  onMouseUp: (e) =>
    @clone.resize @area.width()

  # After a `Concept` was appended to the `Entry.fuzz` attribute, we update the `@area` and focus on it with `Fuzz#setCaret`, so that input may be continued
  onRelevantConceptAppended: =>
    fuzz = @model.get('fuzz')
    @area.val fuzz + ' '
    @setCaret fuzz.length + 1
    @model.fetchRelevantConcepts()
  
  # After an `Entry` was successfully created, we clear our current model and start from scratch
  onClear: =>
    @area.val ''

  # Selects a range of characters, keeping in mind the browser quirks
  setSelection: (start, end) ->
    textarea = @area.get(0)
    if textarea.setSelectionRange
      textarea.focus()
      textarea.setSelectionRange start, end
    else if @area.createTextRange
      range = textarea.createTextRange()
      range.collapse true
      range.moveEnd "character", end
      range.moveStart "character", start
      range.select()
    console.log @, '#setSelection'
  
  # Sets caret to a specified position by selecting no characters at that offset
  setCaret: (pos) ->
    pos ||= @model.get('fuzz').length
    @setSelection pos, pos
  
  resizeArea: ->
    newHeight =  @clone.$el.height()
    
    if @model.get('fuzz').length > 0 || @focused
      newHeight += @lineHeight
    @area.height newHeight
    

  resizeRequired: ->
    probably = false
    if @area.height() != @clone.height() + (@lineHeight * @focused)
      probably = true
    
    probably

  # currentWord: ->
  #   @textarea.caretPosition

  autoCompletable: ->
    actually = false

    #word = @currentWord()
    #if @isConcept(word)

    if false
      actually = true
    
    actually

  focusArea: =>
    console.log @, '#focusArea'
    @area.get(0).focus()

  # Proxy to `FuzzClone` which calculates the correct position for `SuggestedConcepts`
  getAutoCompleteOffsets: ->
    @clone.getAutoCompleteOffsets()

  render: =>
    @$el.html @template @model.toJSON()
    @area = @$('textarea')
    @$clone = @clone.render().el
    @$el.append @$clone
    @

  # Some browsers don't return proper sizes until we're attached to the DOM
  onRendered: =>
    @lineHeight = @area.css('lineHeight')
    @lineHeight = parseInt @lineHeight.substr(0, @lineHeight.indexOf('px'))
    @clone.onRendered()
    @resizeArea()
    

  # If a user presses the return key twice
  # we finish editing the current entry and
  # return to a new awesomebar for search
  finishEditing: ->
    @awsmbar.createEntry(@model)
    @area.blur()
    @onBlur()

  initialize: (options) ->
    @awsmbar = options.awsmbar

    @focused = 0
    @clone = new MM.Views.AwsmBar.Fuzz.Clone role_model: @, model: @model

    # We don't need to rerender every time, but we want to know when a new `Concept` was appended
    @model.on 'relevantConceptAppended', @onRelevantConceptAppended
    

# Replicates textarea in a div and reports back measurements
class MM.Views.AwsmBar.Fuzz.Clone extends Backbone.View
  template: _.template "<span><%= fuzz %></span>"
  className: 'awsmbar-clone'

  traits: [
    'lineHeight', 'textDecoration', 'letterSpacing',
    'fontSize', 'fontFamily', 'fontStyle', 'fontWeight', 'textRendering',
    'textTransform', 'textAlign', 'direction', 'wordSpacing', 'fontSizeAdjust',
    'paddingTop', 'paddingLeft', 'paddingBottom', 'paddingRight', 'width', 'whiteSpace',
    'textIndent'
  ]

  height: ->
    @.$el.height()

  impersonate: =>
    console.log @, '#impersonate', @role_model
    for trait in @traits  
      @el.style[trait] = @role_model.area.css(trait)
  
  last_word: (sentence) ->
    sentence.substr sentence.lastIndexOf(' '), sentence.length
  
  subdivide: ($pan) ->
    if $pan.height() > @lineHeight
      carry = ''
      while $pan.height() > @lineHeight
        content = $pan.html()
        length = content.length
        if (last_word_start = content.lastIndexOf ' ') > -1
          carry = content.substr(last_word_start, length) + carry
          content = content.substr(0, last_word_start)
        else
          # Cannot break word. Splitting by characters
          carry = content.substr(content.length - 1, content.length)
          content = content.substr(0, content.length - 1)
        $pan.text(content)
      $br = $("<br>").insertAfter($pan)
      $s = $("<span>"+carry+"</span>").insertAfter($br)
      @subdivide $s
    else if $pan.text() == ''
      $pan.text('&nbsp;')

  parrot: =>
    fuzz = @model.get('fuzz')
    fuzz = fuzz.split('\n')
    if _(fuzz).last() == ''
      fuzz[fuzz.length - 1] = '&nbsp;'
    fuzz = '<span>' + fuzz.join('</span><br><span>') + '</span>'
    @.$el.html fuzz
    # Subdivide long words like URLs etc.
    # for span in @.$el.children('span')
    #  @subdivide $(span)

  resize: (width) ->
    @.$el.width(width)
    #@.$el.height(height)
    @role_model.resizeArea()

  getAutoCompleteOffsets: ->
    $lastSpan = @$('span').last()
    offset = $lastSpan.offset()
    console.log @, '#getAutoCompleteOffsets', offset
    offset =
      left: offset.left + $lastSpan.width()
      top: offset.top + $lastSpan.height()
    offset

  render: =>
    @.$el.html @template @role_model.model.toJSON()
    @

  onRendered: =>
    @impersonate()

    
  initialize: (options) ->
    @role_model = options.role_model    
    @model.bind 'change', @parrot



