# # Workflows
#
# `Workflow` holds possible states an `Entry` could be in

class MM.Workflow extends Backbone.Model
  default:
    id: ''
    label: ''

  parse: (values) ->
    values

  buildStates: ->
    @states = []
    for state in @get('states')
      @states.push new MM.WorkflowState(state)
  initialize: ->
    @buildStates()
    console.log @, '#init', @get('label')

MM.Workflows ||= {}

class MM.Workflows extends Backbone.Collection
  model: MM.Workflow

  # Intended to work with `MM.Sync.Workflows`
  sync: MM.Sync.StubbedWorkflows

  # The `response` is structured in a peculiar way (`id` values as primary keys)
  parse: (response) ->
    results = []
    # If we recieved an `Workflows`
    if _.isObject(response.workflow)
      # we iterate through the object values, representing individual workflows
      for key_id, value_workflow of response.workflow when _.isObject(value_workflow)
        # and we assemble the `Workflow` value object from various `JSON` leaves
        workflow = {}
        workflow.id = key_id
        workflow.label = 'uninitialized'
        workflow.states = []
        # The first key holds the `label` of a `Workflow` and the value is an array of its `WorkflowStates`
        for key_workflowLabel, value_states of value_workflow when workflow.label is 'uninitialized'
          workflow.label = key_workflowLabel
          workflow.states = value_states
        # Append the assembled workflow
        results.push workflow

    console.log @, '#parse', response, results

    results

  url: ->
    base = MM.Sync.URL
    login = MM.session.get('account')

    "#{base}/appdata/#{login}"
  

  initialize: ->
    console.log @, '#init', 'LOL'


class MM.WorkflowState extends Backbone.Model
  defaults:
    fg_id: ''
    label: ''
  parse: (values) ->
    return {
      fg_id: values.fg
      label: values.name
    }
  initialize: (state) ->
    @clear()
    @set(@parse(state))
    console.log @, '#init', @get('label')
