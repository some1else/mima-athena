# middlemachine | phoenix

Phoenix is the MVC javascript client for middlemachine API.

## Install:

### Requirements

* Ruby 1.9 & Rubygems: http://www.ruby-lang.org/en/downloads/

### Procedure

After you have Ruby and Rubygems installed, run

  `gem install bundler`

This will install the `Bundler` dependency managment gem. Change the working directory to project root (where this `README` is located) and run

  `bundle`

This will download and install the required gems from the `Gemfile`, of which the most important are:

* `guard` - Used to watch files for changes and run preprocessing commands 
* `haml` - An `HTML` preprocessor
* `sass` - A `CSS` preprocessor
* `coffee-script` - A `JavaScript` preprocessor
* `redcarpet" - A `Markdown` library
* `rocco` - A literal-style documentation generator
* `jammit' - An asset packager

### Usage

To observe files for changes and run preprocessing accordingly just run

`bundle exec guard`

This run the guard file watcher in the scope of the bundle and watch for changes, as well as open an interactive console for `guard` scripts

In order to manually run all the `guard` scripts, simply press enter when the `guard` interactive console launches

