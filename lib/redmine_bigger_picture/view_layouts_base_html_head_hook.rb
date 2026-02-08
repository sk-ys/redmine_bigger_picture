module RedmineBiggerPicture
  class ViewLayoutsBaseHtmlHeadHook < Redmine::Hook::ViewListener
    def view_layouts_base_html_head(context)
      controller = context[:controller]
      action = controller.action_name

      if (controller.controller_name == 'issues' && ['show'].include?(action))
        # TODO: Add support for the issues index page
        stylesheet_link_tag('bigger-picture', plugin: 'redmine_bigger_picture') +
        stylesheet_link_tag('redmine_bigger_picture', plugin: 'redmine_bigger_picture') +
        javascript_include_tag('bigger-picture.min', plugin: 'redmine_bigger_picture') +
        javascript_include_tag('redmine_bigger_picture', plugin: 'redmine_bigger_picture')
      end
    end
  end
end
