require 'test_helper'

class GooglecalControllerTest < ActionDispatch::IntegrationTest
 
  test 'anyone logged out can get free consoluts and events' do
    get "/events/public/#{Date.today}/#{Date.today + 1.weeks}"
    body = JSON.parse(response.body)
    assert body["appointments"]
    assert body["consults"]
  end


  # This assumes that there are some consult slots and appointment slots in the next week
  test 'unaproved clients can only see consults and existing appointments' do
    sign_in users(:unapprovedClient)
    get "/events/current_user/#{Date.today}/#{Date.today + 1.weeks}"
    body = JSON.parse(response.body)
    assert body["appointments"].length === 0
    assert body["consults"].length > 1
  end

  test 'approved clients can only see appointment slots and existing appointments' do
    sign_in users(:approvedClient)
    get "/events/current_user/#{Date.today}/#{Date.today + 1.weeks}"
    body = JSON.parse(response.body)
    assert body["appointments"].length > 1
    assert body["consults"].length === 0
  end

  test 'admin can get all events from schedule' do
    sign_in users(:admin)
    get "/events/schedule/#{Date.today}/#{Date.today + 1.weeks}"
    body = JSON.parse(response.body)
    assert body["appointments"].length > 1
    assert body["consults"].length > 1
  end

  # test 'admin can create appointment slots' do
  #   sign_in users(:admin)
  #   post events_create_path, params: {event: {"slots"=>["2019-10-14T13:00:00.000Z"], "start"=>"2019-10-14T13:00:00.000Z", "end"=>"2019-10-14T13:00:00.000Z", "action"=>"click", "box"=>{"x"=>304, "y"=>495, "clientX"=>304, "clientY"=>495}, "title"=>"", "location"=>"", "start_time"=>"2019-10-14T13:00:00.000Z", "end_time"=>"2019-10-14T13:00:00.000Z", "personal"=>false, "extended_properties"=>{"private"=>{"skype"=>"false", "paid"=>"false"}}}}
  #   # byebug
  #   # body = JSON.parse(response.body)

  # end


end
