class MainController < ApplicationController
     before_action :createInstance
    
    def createInstance
        begin
            @cal = Google::Calendar.new(
                :client_id     => ENV['GOOGLE_CLIENT_ID'], 
                :client_secret => ENV['GOOGLE_CLIENT_SECRET'],
                :calendar      => ENV['GOOGLE_CALENDAR_ADDRESS'],
                :redirect_url  => ENV['GOOGLE_REDIRECT_URL'],
                                )
                @cal.login_with_refresh_token(ENV['GOOGLE_REFRESH_TOKEN'])               
            rescue
                puts "login error"
        end
    end

    # def calendarAuthLink
    #     cal = Google::Calendar.new(
    #             :client_id     => ENV['GOOGLE_CLIENT_ID'], 
    #             :client_secret => ENV['GOOGLE_CLIENT_SECRET'],
    #             :calendar      => params["email"],
    #             :redirect_url  => ENV['GOOGLE_REDIRECT_URL']
    #                             )
    #                             byebug
    #         redirect_to(cal.authorize_url.to_str)
    # end

    def personalCalendarEvents
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

    def home
        user = nil
        personalEvents = nil
        users = User.all

        if current_user
            user = current_user
        begin
            if user.admin === true && user.google_calendar_email  && user.google_calendar_refresh_token
                
                personalCalendarEvents 
                personalEvents = @personalCal.events
                
            end
        rescue
                puts "error fetching personal events"
                personalEvents = nil
            end
        
        

        end

        

        

        render react_component: 'App', props: { events: @cal.events, personalEvents: personalEvents, posts: Post.all, user: user, baseUrl: ENV["BASE_URL"], users: users}
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

        event = @cal.create_event do |e|
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

    def deleteEvent
        event = params["event"]
        found = @cal.find_event_by_id(event["id"])
        found.first.delete

    end

    def all 
        puts @cal.events
    end

end
