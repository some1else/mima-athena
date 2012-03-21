# Guardfile
# https://github.com/guard/guard#readme

guard 'sass', :input => 'src/sass', :output => 'public/css'

guard 'haml', :input => 'src/haml', :output => 'public/' do
  watch(/^.+(\.html\.haml)/)
end

guard 'coffeescript', :input => 'src/coffee', :output => 'public/js'

guard 'rocco', :run_on => [:start, :change], :dir => 'doc', :stylesheet => 'http://jashkenas.github.com/docco/resources/docco.css' do
  watch(%r{^src/.*\.(rb|coffee)$})
  # watch(%r{^lib/.*\.rb$})
end

guard :jammit do
  watch(%r{^public/javascripts/(.*)\.js$})
  watch(%r{^public/stylesheets/(.*)\.css$})
end
