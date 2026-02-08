$LOAD_PATH.unshift File.expand_path(File.dirname(__FILE__) + '/lib')
require_dependency 'redmine_bigger_picture/view_layouts_base_html_head_hook'

Redmine::Plugin.register :redmine_bigger_picture do
  name 'Redmine Bigger Picture plugin'
  author 'sk-ys'
  description 'A Bigger Picture integration plugin for Redmine'
  version '0.1.0'
  url 'http://github.com/sk-ys/redmine_bigger_picture'
  author_url 'http://github.com/sk-ys'
end
