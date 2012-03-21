window.MM ||= {}
MM.Views ||= {}

#### Entry Views

# A collection of `Entries`
# shown in the Agenda view
class MM.Views.Entries extends Backbone.View
  className: 'entries'
  template: _.template('')

  # When `Entries` are `reset` as an entire collection, we want them to append to the bottom. But when the user adds individual `Entries` with `Entries#create`, we want them to be prepended to the top
  add: (entry, append = false) =>
    view = new MM.Views.Entry model: entry
    if append
      @$el.append view.render().el
    else
      @$el.prepend view.render().el

  reset: =>
    console.log @, '#reset', @collection
    @render()
    @add(entry, append: true) for entry in @collection.models

  render: =>
    @$el.html @template()
    @

  initialize: ->
    @collection.on 'reset', @reset 
    @collection.on 'add', @add

# Most common entry view
# shows the fuzz
class MM.Views.Entry extends Backbone.View
  template: _.template('<span class="fuzz"><%= fuzz %></span>')
  className: 'entry'

  events:
    'click': 'editOrDestroy'

  editOrDestroy: (e) =>
    e.preventDefault()
    if e.shiftKey
      @destroy()
    else
      # @edit

  destroy: ->
    @model.destroy()
    @$el.remove()
    
  render: =>
    @$el.html @template @model.toJSON()
    if @model.hasWorkflow()
      @$el.append @workflow.render().el
    @

  initialize: ->
    if @model.hasWorkflow()
      @workflow = new MM.Views.EntryWorkflow(model: @model)

class MM.Views.EntryWorkflow extends Backbone.View
  template: _.template('
    <div class="btn-group">
      <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
        <%= workflow_label %>
        <span class="caret"></span>
      </a>
      <ul class="dropdown-menu">
      </ul>
    </div>
  ')
  className: 'state'

  render: =>
    @$el.html @template @model.toJSON()
    @$dropdown = @$('.dropdown-menu')
    for state in @model.workflow.states
      stateOption = new MM.Views.EntryStateOption(model: state, entry: @model)
      @$dropdown.append stateOption.render().el
    @

class MM.Views.EntryStateOption extends Backbone.View
  template: _.template('<a href="#"><%= label %></a>')
  tagName: 'li'

  events:
    'click': 'change'

  # When the user choses a new `Workflow` state, we set `Entry.wf_id`
  change: (e) =>
    e.preventDefault()
    @entry.set
      fg: @model.get('fg_id')
      status: @model.get('label')

    console.log @, 'change', @entry
    @entry.save()

  render: ->
    @$el.html @template @model.toJSON()
    @

  initialize: (options) ->
    @entry = options.entry

class MM.Views.URLEntry extends MM.Views.Entry
  template: _.template('<a href="<%= url %>"></a>')