class MainController < ApplicationController
     before_action :createInstance
    
    def createInstance
        begin
            @cal = Google::Calendar.new(
                :client_id     => ENV['GOOGLE_CLIENT_ID'], 
                :client_secret => ENV['GOOGLE_CLIENT_SECRET'],
                :calendar      => ENV['GOOGLE_CALENDAR_ADDRESS'],
                :redirect_url  => ENV['GOOGLE_REDIRECT_URL']
                                )
                @cal.login_with_refresh_token(ENV['GOOGLE_REFRESH_TOKEN'])               
            rescue
                puts "login error"
        end
    end

    def home
        user = nil
        if current_user
            user = current_user
        end
        render react_component: 'App', props: { events: @cal.events, posts: Post.all, user: user, baseUrl: ENV["BASE_URL"]}
    end

    def refresh 
        user = nil
        if current_user
            user = current_user
        end
        render json: {user: user, events: @cal.events, posts: Post.all} 
    end

    def createEvent
        # byebug
        newEvent = params["event"]
        event = @cal.create_event do |e|
            e.title = 'Free Appointment Slot'
            e.start_time = newEvent["slots"].first
            e.end_time = newEvent["slots"].second
            e.location= "609 W 135 St New York, New York"
            # byebug
            e.reminders =  { "useDefault": false }
            # e.notes= "one fine day in the middle of the night, two dead men got up to fight"
        #     e.attendees= [
        #     {'email' => current_user.email, 'displayName' => "#{current_user.first_name} #{current_user.last_name}" , 'responseStatus' => 'tentative'},
        # ]
        end
        # byebug
        render json: {event: event}

    end

    def editEvent

        user = params["user"]
        event = params["event"]
        
        fullName = "#{user['first_name']} #{user['last_name']}"

        editedEvent = @cal.find_or_create_event_by_id(event["id"]) do |e|
            e.title = fullName + " | session confirmed"
            e.color_id = 2
            # e.end_time = Time.now + (60 * 60 * 2) # seconds * min * hours
            e.location= "609 W 135 St New York, New York"
            # e.notes= "one fine day in the middle of the night, two dead men got up to fight"
            e.attendees= [
            {'email' => 'olinelson93@gmail.com', 'displayName' => 'Oli Nelson', 'responseStatus' => 'accepted'},
            {'email' => user["email"], 'displayName' => fullName, 'responseStatus' => 'accepted'}]
        end

        render json: {events: @cal.events} 
    end

    def all 
        puts @cal.events
    end

end
