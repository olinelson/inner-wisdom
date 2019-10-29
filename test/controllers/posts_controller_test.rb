require 'test_helper'

class PostsControllerTest < ActionDispatch::IntegrationTest
  
    test 'anyone can see blog page' do
        get "/blog"
        assert_response :success
    end

    test 'anyone can see blog show page' do
        get "/posts/#{Post.find_by(title: 'postOne').id}"
        assert_response :success
    end


end
