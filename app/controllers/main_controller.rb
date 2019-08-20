class MainController < ApplicationController
     before_action :initAppointmentsCal, :initConsultsCal, :createPersonalCalInstance
    
    def initAppointmentsCal
        begin
            @appointmentsCal = Google::Calendar.new(
                :client_id     => ENV['GOOGLE_CLIENT_ID'], 
                :client_secret => ENV['GOOGLE_CLIENT_SECRET'],
                :calendar      => ENV['APPOINTMENTS_CALENDAR_ID'],
                :redirect_url  => ENV['GOOGLE_REDIRECT_URL']
                                )
                @appointmentsCal.login_with_refresh_token(ENV['GOOGLE_REFRESH_TOKEN'])    
                

            rescue
                puts "login error"

        end

        
    end

     def initConsultsCal
        begin
            @consultsCal = Google::Calendar.new(
                :client_id     => ENV['GOOGLE_CLIENT_ID'], 
                :client_secret => ENV['GOOGLE_CLIENT_SECRET'],
                :calendar      => ENV['CONSULTS_CALENDAR_ID'],
                :redirect_url  => ENV['GOOGLE_REDIRECT_URL']
                                )
                @consultsCal.login_with_refresh_token(ENV['GOOGLE_REFRESH_TOKEN'])       
                

            rescue
                puts "login error"

        end

        
    end

    

    def createPersonalCalInstance
        if current_user && current_user.admin && current_user.google_calendar_email && current_user.google_calendar_refresh_token && current_user.google_calendar_refresh_token.length > 1

            begin
                calendar_address = current_user.google_calendar_email
                @personalCal = Google::Calendar.new(
                    :client_id     => ENV['GOOGLE_CLIENT_ID'], 
                    :client_secret => ENV['GOOGLE_CLIENT_SECRET'],
                    :calendar      => calendar_address,
                    :redirect_url  => ENV['GOOGLE_REDIRECT_URL']
                                    )

                    @personalCal.login_with_refresh_token(current_user.google_calendar_refresh_token)               
                rescue
                    puts "personal login error"
            end

        end
        
    end

    def eventsInDateWindow(cal)
        now = DateTime.new(2018,1,1)
        twoYearsAgo = now << 24
        twoYearsAhead = now >> 24
        cal.find_events_in_range(twoYearsAgo,twoYearsAhead, options = {max_results: 2500})
    end

    def home
        user = nil
        personalEvents = nil
        users = User.all

        if current_user
            user = current_user
        begin
            if user.google_calendar_email  && user.google_calendar_refresh_token

                personalEvents = eventsInDateWindow(@personalCal)
            end
        rescue
                puts "error fetching personal events"
                personalEvents = nil
            end
        
        

        end

        begin
            appointments = eventsInDateWindow(@appointmentsCal)
            rescue
            appointments = []    
        end

         begin
            consults = eventsInDateWindow(@consultsCal)
            rescue
            consults = []    
        end



        render react_component: 'App', props: { 
            appointments: appointments, 
            consults: consults, 
            personalEvents: personalEvents, 
            posts: Post.all, 
            user: user, 
            baseUrl: ENV["BASE_URL"], 
            users: users, 
            businessCalendarAddress: ENV["GOOGLE_CALENDAR_ADDRESS"]
        }
    end


    def createEvent
        newEvent = params["event"]
        title= ""

        if newEvent["attendees"]
             attendees = newEvent["attendees"].map do |a|
            {
                'email' => a["email"],
                'displayName' => a["first_name"] + " " + a["last_name"], 
                'responseStatus' => 'tentative'
            }
            end

            fullName = newEvent["attendees"].first["first_name"] + newEvent["attendees"].first["last_name"]
            title = fullName + " | session confirmed"

        end

        if newEvent["personal"]
            return createGoogleEvent(cal: @personalCal, newEvent: newEvent, title: newEvent["title"])
        end

        if params["appointmentSlot"]
            return createGoogleEvent(cal: @appointmentsCal,newEvent: newEvent, title: "Available Appointment")
        end
        if params["consultSlot"]
            return createGoogleEvent(cal: @consultsCal,newEvent: newEvent, title: "Available Phone Consult")
        end

        return createGoogleEvent(cal: @appointmentsCal, newEvent: newEvent, title: title, attendees: attendees )
    end


    def createGoogleEvent(cal:, newEvent:, title:, attendees: [])
        event = cal.create_event do |e|
            e.title = title
            e.start_time = newEvent["start_time"]
            e.end_time = newEvent["end_time"]
            e.location= newEvent["location"]
            e.reminders =  { "useDefault": false }
            e.attendees= attendees
        end

        #  render json: {scrollToEvent: event, events: eventsInDateWindow(@appointmentsCal), personalEvents: @personalCal ? eventsInDateWindow(@personalCal) : [] }
        return appStateJson(scrollToEvent: event)
    end

    def appStateJson(scrollToEvent: [])
         render json: {scrollToEvent: scrollToEvent, appointments: eventsInDateWindow(@appointmentsCal), consults: eventsInDateWindow(@consultsCal), personalEvents: @personalCal ? eventsInDateWindow(@personalCal) : [] }
    end

   

    def purchase
        user = current_user
        event = params["event"]
        fullName = user.first_name + " " + user.last_name
        newTitle = ""

        cal = nil

        if event["calendar"]["id"] === ENV["APPOINTMENTS_CALENDAR_ID"]
             newTitle = fullName + " | session confirmed"
            cal = @appointmentsCal

            editedEvent = cal.find_or_create_event_by_id(event["id"]) do |e|
            e.title = newTitle
            e.color_id = 2
            e.location= "609 W 135 St New York, New York"
            e.attendees= [
            {'email' => user.email, 'displayName' => fullName, 'responseStatus' => 'accepted'}]
             end

            jsonEvent = editedEvent.to_json
            NotificationMailer.user_appointment_confirmation(user, jsonEvent).deliver_later
            NotificationMailer.admin_appointment_confirmation(user, jsonEvent).deliver_later
        
        end

        if event["calendar"]["id"] === ENV["CONSULTS_CALENDAR_ID"]
            newTitle = fullName + "| Phone Call Consultation"
            cal = @consultsCal

            editedEvent = cal.find_or_create_event_by_id(event["id"]) do |e|
            e.title = newTitle
            e.color_id = 2
            # e.location= "609 W 135 St New York, New York"
            e.attendees= [
            {'email' => user.email, 'displayName' => fullName, 'responseStatus' => 'accepted'}]
            end

             jsonEvent = editedEvent.to_json
             NotificationMailer.user_consult_confirmation(user, jsonEvent).deliver_later
             NotificationMailer.admin_consult_confirmation(user, jsonEvent).deliver_later
        
        end


        # editedEvent = cal.find_or_create_event_by_id(event["id"]) do |e|
        #     e.title = newTitle
        #     e.color_id = 2
        #     e.location= "609 W 135 St New York, New York"
        #     e.attendees= [
        #     {'email' => user.email, 'displayName' => fullName, 'responseStatus' => 'accepted'}]
        # end

        # render json: {events: eventsInDateWindow(@appointmentsCal)} 
       
        return appStateJson(scrollToEvent: event)

    end

    def cancelEvent
        event = params["event"]
        inGracePeriod = params["inGracePeriod"]
        user = current_user
        attendees= []

         if inGracePeriod
            event["title"] = "Available Appointment"
        end

         if !inGracePeriod && event["attendees"] 
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
        jsonEvent = event.to_json
        NotificationMailer.user_appointment_cancelation(user, jsonEvent).deliver_later
        # NotificationMailer.admin_appointment_confirmation(user, jsonEvent).deliver_later
        

        return editGoogleCalEvent(cal: @appointmentsCal, event: event, attendees: attendees)
    end


    def updateEvent
        event = params["event"]

        attendees= []

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

        #  personal
        if event["calendar"]["id"] === current_user.google_calendar_email
                return editGoogleCalEvent(cal: @personalCal, event: event)
        end

        # business
        if event["calendar"]["id"] === ENV["APPOINTMENTS_CALENDAR_ID"]
                return editGoogleCalEvent(cal: @appointmentsCal, event: event, attendees: attendees)
        end

        if event["calendar"]["id"] === ENV["CONSULTS_CALENDAR_ID"]
                return editGoogleCalEvent(cal: @consultsCal, event: event, attendees: attendees)
        end
    end

    def editGoogleCalEvent(cal:, event:, attendees: [])

        editedEvent = cal.find_or_create_event_by_id(event["id"]) do |e|
            e.title = event["title"]
            e.color_id = 2
            e.start_time = event["start_time"]
            e.end_time = event["end_time"]
            # e.end_time = Time.now + (60 * 60 * 2) # seconds * min * hours
            e.location= event["location"]
            # e.notes= "one fine day in the middle of the night, two dead men got up to fight"
            e.attendees = attendees
        end

        return appStateJson(scrollToEvent: editedEvent)
        #  render json: {scrollToEvent: editedEvent, events: eventsInDateWindow(@appointmentsCal)} 
    end



    def deleteEvent
         event = params["event"]

         if event["calendar"]["id"] === current_user.google_calendar_email
                cal = @personalCal
        end

        if event["calendar"]["id"] === ENV["GOOGLE_CALENDAR_ADDRESS"]
            cal = @appointmentsCal
        end

       
        found = cal.find_event_by_id(event["id"])

        found.first.delete

        return appStateJson(scrollToEvent: event)

        # render json: {scrollToEvent: event, events: eventsInDateWindow(@appointmentsCal), personalEvents: eventsInDateWindow(@personalCal)}

    end

    # def deleteAllEvents(cal)
    #     cal.events.each do |e|
    #         e.delete
    #     end
    # end

    def all 
        puts @appointmentsCal.events
    end

end
