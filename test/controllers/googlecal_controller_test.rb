require 'test_helper'

class GooglecalControllerTest < ActionDispatch::IntegrationTest
 
  test 'anyone logged out can get free consoluts and events' do
   get "/events/public/#{Date.today}/#{Date.today + 1.weeks}"
   body = JSON.parse(response.body)
   assert body["appointments"]
   assert body["consults"]
  end


  # This assumes that there are consult slots and appointment slots in the next week
  test 'unaproved clients can only see consults and existing appointments' do
  sign_in users(:newClient)

   get "/events/current_user/#{Date.today}/#{Date.today + 1.weeks}"
   body = JSON.parse(response.body)
   assert body["appointments"].length === 0
   assert body["consults"].length > 1
  end

  test 'approved clients can only see appointment slots and existing appointments' do
  sign_in users(:client)

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


end
