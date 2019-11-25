require 'test_helper'

class GooglecalControllerTest < ActionDispatch::IntegrationTest
  @@appointmentSlot = nil
  @@bookedAppointment = nil
  @@consultSlot = nil
  @@now = Time.now.utc + 3600
  @@anHourFromNow = @@now + 3600 

  test 'anyone logged out can get free consoluts and events' do
    get "/api/v1/events/public/#{Date.today}/#{Date.today + 1.weeks}"
    body = JSON.parse(response.body)
    assert body["events"]
  end

  # This assumes that there are some consult slots and appointment slots in the next week
  test 'unaproved clients can only see consults and existing appointments' do
    sign_in users(:unapprovedClient)
    get "/api/v1/events/current_user/#{Date.today}/#{Date.today + 1.weeks}"
    body = JSON.parse(response.body)
    # must figure out a better way to test this!
    assert body["events"]
  end

  test 'approved clients can only see appointment slots and existing appointments' do
    sign_in users(:approvedClient)
    get "/api/v1/events/current_user/#{Date.today}/#{Date.today + 1.weeks}"
    body = JSON.parse(response.body)
    assert body["appointments"].length > 1
    assert body["consults"].length === 0
  end

  test 'admin can get all events from schedule' do
    sign_in users(:admin)
    get "/api/v1/events/schedule/#{Date.today}/#{Date.today + 1.weeks}"
    body = JSON.parse(response.body)
    assert body["appointments"].length > 1
    assert body["consults"].length > 1
  end

  test 'admin can create appointment slots' do
    sign_in users(:admin)
    post events_create_path, params: {appointmentSlot: true, event: { "start"=>"#{@@now.to_json}", "end"=>"#{@@anHourFromNow.to_json}", "action"=>"click", "box"=>{"x"=>304, "y"=>495, "clientX"=>304, "clientY"=>495}, "title"=>"", "location"=>"", "start_time"=>"#{@@now.to_json}", "end_time"=>"#{@@anHourFromNow.to_json}", "extended_properties"=>{"private"=>{"skype"=>"false", "paid"=>"false"}}}}
    body = JSON.parse(response.body)
    @@appointmentSlot = body["newEvent"]
    assert body["newEvent"]["id"].length
    body["newEvent"]["calendar"]["id"] === ENV["APPOINTMENTS_CALENDAR_ID"]
  end

  test 'admin can create consult slots' do
    sign_in users(:admin)
    post events_create_path, params: {consultSlot: true, event: {"slots"=>["#{@@now.to_json}"], "start"=>"#{@@now.to_json}", "end"=>"#{@@anHourFromNow.to_json}", "action"=>"click", "box"=>{"x"=>304, "y"=>495, "clientX"=>304, "clientY"=>495}, "title"=>"", "location"=>"", "start_time"=>"#{@@now.to_json}", "end_time"=>"#{@@anHourFromNow.to_json}", "extended_properties"=>{"private"=>{"skype"=>"false", "paid"=>"false"}}}}
    body = JSON.parse(response.body)
    @@consultSlot = body["newEvent"]
    assert body["newEvent"]["id"].length
    assert body["newEvent"]["calendar"]["id"] === ENV["CONSULTS_CALENDAR_ID"]
  end

  test 'admin can create booked appointments' do
    sign_in users(:admin)
    approvedClient = User.find_by(first_name: 'approvedClient')
    post events_create_path, params: { event: { attendees: [{ email: approvedClient.email, first_name: approvedClient.first_name, last_name: approvedClient.last_name}], "slots"=>["#{@@now.to_json}"], "start"=>"#{@@now.to_json}", "end"=>"#{@@anHourFromNow.to_json}", "action"=>"click", "box"=>{"x"=>304, "y"=>495, "clientX"=>304, "clientY"=>495}, "title"=>"", "location"=>"", "start_time"=>"#{@@now.to_json}", "end_time"=>"#{@@anHourFromNow.to_json}", "extended_properties"=>{"private"=>{"skype"=>"false", "paid"=>"false"}}}}
    body = JSON.parse(response.body)
    @@bookedAppointment = body["newEvent"]
    assert ["id"].length
    assert body["newEvent"]["calendar"]["id"] === ENV["APPOINTMENTS_CALENDAR_ID"]
    assert body["newEvent"]["attendees"][0]["email"] === approvedClient.email
  end

  test 'unapproved clients can book consults' do
    sign_in users(:unapprovedClient)
    unapprovedClient = User.find_by(first_name: 'unapprovedClient')
    post '/api/v1/events/book', params: { event: @@consultSlot}
    body = JSON.parse(response.body)
    assert body["editedEvent"]["attendees"][0]["email"] === unapprovedClient.email
  end

  test 'admin can delete booked appointments' do
    sign_in users(:admin)
    post '/api/v1/events/delete', params: {event: @@bookedAppointment}
    body = JSON.parse(response.body)
    assert body["deletedEvent"]
  end

  test 'admin can delete appointment slots' do
    sign_in users(:admin)
    post '/api/v1/events/delete', params: {event: @@appointmentSlot}
    body = JSON.parse(response.body)
    assert body["deletedEvent"]
  end

  test 'admin can delete consults' do
    sign_in users(:admin)
    post '/api/v1/events/delete', params: {event: @@consultSlot}
    body = JSON.parse(response.body)
    assert body["deletedEvent"]
  end
  

  

end
