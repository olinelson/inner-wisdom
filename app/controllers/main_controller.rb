class MainController < ApplicationController
     before_action :createBusinessCalInstance, :createPersonalCalInstance
    
    def createBusinessCalInstance
        begin
            @businessCal = Google::Calendar.new(
                :client_id     => ENV['GOOGLE_CLIENT_ID'], 
                :client_secret => ENV['GOOGLE_CLIENT_SECRET'],
                :calendar      => ENV['GOOGLE_CALENDAR_ADDRESS'],
                :redirect_url  => ENV['GOOGLE_REDIRECT_URL'],
                                )
                @businessCal.login_with_refresh_token(ENV['GOOGLE_REFRESH_TOKEN'])               
            rescue
                puts "login error"

        end
        
    end

    def createPersonalCalInstance
        if current_user.google_calendar_email
            begin
                @personalCal = Google::Calendar.new(
                    :client_id     => ENV['GOOGLE_CLIENT_ID'], 
                    :client_secret => ENV['GOOGLE_CLIENT_SECRET'],
                    :calendar      => current_user.google_calendar_email,
                    :redirect_url  => ENV['GOOGLE_REDIRECT_URL'],
                                    )
                    @personalCal.login_with_refresh_token(current_user.google_calendar_refresh_token)               
                rescue
                    puts "login error"
            end

        end
        
    end

    def home
        user = nil
        personalEvents = nil
        users = User.all

        if current_user
            user = current_user
        begin
            if user.admin === true && user.google_calendar_email  && user.google_calendar_refresh_token
                
                 
                personalEvents = @personalCal.events
                
            end
        rescue
                puts "error fetching personal events"
                personalEvents = nil
            end
        
        

        end

        



        render react_component: 'App', props: { events: @businessCal.events, personalEvents: personalEvents, posts: Post.all, user: user, baseUrl: ENV["BASE_URL"], users: users, businessCalendarAddress: ENV["GOOGLE_CALENDAR_ADDRESS"]}
    end


    def createEvent
        newEvent = params["event"]
        title = "Available Appointment"
        
        if newEvent["appointmentSlot"] == false
            fullName = newEvent["attendees"].first["first_name"] + newEvent["attendees"].first["last_name"]
            title = fullName + " | session confirmed"
        end

        if newEvent["attendees"]
             attendees = newEvent["attendees"].map do |a|
            {
                'email' => a["email"],
                'displayName' => a["first_name"] + " " + a["last_name"], 
                'responseStatus' => 'tentative'
            }
            end

            title = ""

            attendees.each do |a|
            title << a["displayName"]
            end

        end

        event = @businessCal.create_event do |e|
            e.title = title
            e.start_time = newEvent["start"]
            e.end_time = newEvent["end"]
            e.location= "609 W 135 St New York, New York"
            # byebug
            e.reminders =  { "useDefault": false }
            # e.notes= "one fine day in the middle of the night, two dead men got up to fight"
            
            
            e.attendees= attendees
        end
        attendees = newEvent["attendees"]

        render json: {event: event, attendees: attendees}

    end

    def editEvent

        user = params["user"]
        event = params["event"]
        
        fullName = "#{user['first_name']} #{user['last_name']}"

        editedEvent = @businessCal.find_or_create_event_by_id(event["id"]) do |e|
            e.title = fullName + " | session confirmed"
            e.color_id = 2
            # e.end_time = Time.now + (60 * 60 * 2) # seconds * min * hours
            e.location= "609 W 135 St New York, New York"
            # e.notes= "one fine day in the middle of the night, two dead men got up to fight"
            e.attendees= [
            {'email' => 'olinelson93@gmail.com', 'displayName' => 'Oli Nelson', 'responseStatus' => 'accepted'},
            {'email' => user["email"], 'displayName' => fullName, 'responseStatus' => 'accepted'}]
        end

        render json: {events: @businessCal.events} 
    end


    def updateEvent
        event = params["event"]

        if event["calendar"]["id"] === current_user.google_calendar_email
                cal = @personalCal
        end

        if event["calendar"]["id"] === ENV["GOOGLE_CALENDAR_ADDRESS"]
            cal = @businessCal
        end


        attendees = nil

        if event["attendees"]
            attendees = event["attendees"].map{|a| 

    
                user = User.find_by(email: a["email"])
                if user === nil
                    displayName= a["email"].split("@").first
                else
                    displayName = user["first_name"] + " " + user["last_name"]
                end
                
                
            {
            'email' => a["email"],
            'displayName' => displayName, 
            'responseStatus' => 'tentative'
             }
            }
        end
        
        editedEvent = cal.find_or_create_event_by_id(event["id"]) do |e|
            e.title = event["title"]
            e.color_id = 2
            e.start_time = event["start_time"]
            e.end_time = event["end_time"]
            # e.end_time = Time.now + (60 * 60 * 2) # seconds * min * hours
            e.location= "609 W 135 St New York, New York"
            # e.notes= "one fine day in the middle of the night, two dead men got up to fight"
            e.attendees = attendees
        end


        render json: {events: @businessCal.events, personalEvents: @personalCal.events } 
    end

    def deleteEvent
        event = params["event"]
        found = @businessCal.find_event_by_id(event["id"])
        found.first.delete

    end

    def all 
        puts @businessCal.events
    end

end
