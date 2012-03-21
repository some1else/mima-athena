window.MM ||= {}
MM.Views ||= {}

# #Landing
# The landing page explains **middlemachine** to the visitor and invites them user to try it out by signing up. Returning users log in using the same form.

class MM.Views.Landing extends Backbone.View
  template: _.template("<div id='upperLoginSignupForm'></div><div id='lowerLoginSignupForm'></div>")
  id: 'views-landing'

  # At the start we create a `Login` model that holds credentials that are used to sign the visitor up or create a user's `Session`. Because in some responsive views the `@upperLoginSignupForm` form is hidden (or vice-versa), they share the same `login` model, so entered credentials remain in tact. For instnance: If the user rotates a tablet and another `LoginSibnupForm` is shown instead, the credentials they may have entered before are present in the other `LoginSignupForm` as well
  initialize: ->
    login = new MM.Login login: 'devuser1', password: 'admin123'
    @upperLoginSignupForm = new MM.Views.LoginSignupForm model: login
    @lowerLoginSignupForm = new MM.Views.LoginSignupForm model: login

  # After rendering the landing template into the `el`, both placeholders for `LoginSignupForms` are found and replaced with their respective `els`
  render: =>
    @$el.html @template()
    upperLoginSignupFormEl = @$('#upperLoginSignupForm')
    upperLoginSignupFormEl.replaceWith @upperLoginSignupForm.render().el
    lowerLoginSignupFormEl = @$('#lowerLoginSignupForm')
    lowerLoginSignupFormEl.replaceWith @lowerLoginSignupForm.render().el
    @
