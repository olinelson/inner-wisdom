class GooglecalController < ApplicationController
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

    def doAnyAttendeesHaveThisEmail(email, attendees)
        attendees.each do |a|
            if a['email'] === email
                return true
            end 
        end
        return false
    end

    def getUsersAndFreeEvents


        begin
            appointments = eventsInDateWindow(@appointmentsCal).select{|a| !a.attendees || doAnyAttendeesHaveThisEmail(current_user.email, a.attendees)}
            rescue
            appointments = []    
        end

         begin
            consults = eventsInDateWindow(@consultsCal).select{|a| !a.attendees || doAnyAttendeesHaveThisEmail(current_user.email, a.attendees)}
            rescue
            consults = []    
        end

        render json: {
            appointments: appointments, 
            consults: consults, 
            }
    end

    def eventsInDateWindow(cal)
        now = DateTime.now()
        oneMonthAgo = now << 1
        oneYearAhead = now >> 12
        cal.find_events_in_range(oneMonthAgo,oneYearAhead, options = {max_results: 2500, expand_recurring_events: true})
       
    end



    def getPublicEvents
        begin
            appointments = futureEvents(@appointmentsCal).select{|a| !a.attendees}
            rescue
            appointments = []    
        end

         begin
            consults = futureEvents(@consultsCal).select{|a| !a.attendees}
            rescue
            consults = []    
        end

        render json: {
            appointments: appointments, 
            consults: consults, 
            }
    end

    def futureEvents(cal)
        cal.find_future_events(options = {max_results: 2500, expand_recurring_events: true })
    end


    def bookEvent
        user = current_user
        event = params["event"]
        fullName = user.first_name + " " + user.last_name
        newTitle = ""
     
        begin
        skype = event["extended_properties"]["private"]["skype"] || false
        rescue
            skype = false
        end
        

        cal = nil

        if event["calendar"]["id"] === ENV["APPOINTMENTS_CALENDAR_ID"]
             newTitle = skype ? fullName + "| skype session confirmed" : fullName + " | session confirmed"
            cal = @appointmentsCal
            
            editedEvent = cal.find_or_create_event_by_id(event["id"]) do |e|
            e.title = newTitle
            e.color_id = 2
            e.location= skype ? "Skype Appointment" : "609 W 135 St New York, New York"
                  
            e.attendees= [
            {'email' => user.email, 'displayName' => fullName, 'responseStatus' => 'accepted'}]
            e.extended_properties["private"]["skype"] = skype
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

            dateString =  DateTime.parse(editedEvent.start_time)
            description = "#{dateString.day}/#{dateString.month}/#{dateString.year} Phone Consultation"

             jsonEvent = editedEvent.to_json
             NotificationMailer.user_consult_confirmation(user, jsonEvent).deliver_later
             NotificationMailer.admin_consult_confirmation(user, jsonEvent).deliver_later
        
        end
        render json:{editedEvent: editedEvent }

    end


    def cancelEvent
        event = params["event"]
        cal = nil
        inGracePeriod = params["inGracePeriod"]

        
          if event["calendar"]["id"] === ENV["APPOINTMENTS_CALENDAR_ID"]
            cal = @appointmentsCal
            if inGracePeriod
                event["title"] =  "Available Appointment"
            end
        end

        if event["calendar"]["id"] === ENV["CONSULTS_CALENDAR_ID"]
            cal = @consultsCal
            if inGracePeriod
                event["title"] =  "Consult Slot"
            end
        end

        
        
        user = current_user
        attendees= []

         

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
        render json: {canceledEvent: event}

        # return editGoogleCalEvent(cal: cal, event: event, attendees: attendees, inGracePeriod: inGracePeriod)
    end

end