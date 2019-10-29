require 'test_helper'

class PagesControllerTest < ActionDispatch::IntegrationTest
  test 'can publicly access home page'do
    get root_path
    assert_response :success
  end

  test 'anyone can access counselling page'do
    get counselling_path
    assert_response :success
  end

  test 'anyone can access supervision page'do
    get supervision_path
    assert_response :success
  end

  test 'anyone can access faqs page'do
    get faqs_path
    assert_response :success
  end

  test 'anyone can access appointments page'do
    get appointments_path
    assert_response :success
  end

  test 'anyone can access contact page'do
    get contact_path
    assert_response :success
  end
  
  test 'anyone can access blog page'do
    get blog_path
    assert_response :success
  end

  test 'admin can access schedule' do
    sign_in users(:admin)
    get schedule_path
    assert_response :success
  end

  test 'if admin goes to appointments, redirected to schedule' do
    sign_in users(:admin)
    get appointments_path
    assert_response :redirect
  end

  test 'if client goes to client show, redirected to my account' do
    sign_in users(:client)
    get "/clients/#{User.find_by(first_name: 'client').id}"
    assert_response :redirect
  end

  test 'admin can access client show' do
    client = User.find_by(first_name: 'client')
    sign_in users(:admin)
    get "/clients/#{client.id}"
    assert_response :success
  end

  

end
