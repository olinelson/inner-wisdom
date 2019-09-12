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

        if attendees 
            attendees.each do |a|
                if a['email'] === email
                    return true
                end 
            end
        end
        
        return false
    end

    def getUsersAndFreeEvents

        if current_user.approved
           
            begin
            appointments = eventsInDateWindow(@appointmentsCal).select{|a| !a.attendees || doAnyAttendeesHaveThisEmail(current_user.email, a.attendees)}
            rescue
            appointments = []   
            end
            
            begin

            consults = eventsInDateWindow(@consultsCal).select{|a| doAnyAttendeesHaveThisEmail(current_user.email, a.attendees)}
            rescue
            consults = []    
            end
        else
            begin
            consults = eventsInDateWindow(@consultsCal).select{|a| !a.attendees || doAnyAttendeesHaveThisEmail(current_user.email, a.attendees)}
            rescue
            consults = []    
            end
        end

        

        # begin
        #     consults = eventsInDateWindow(@consultsCal).select{|a| !a.attendees || doAnyAttendeesHaveThisEmail(current_user.email, a.attendees)}
        #     rescue
        #     consults = []    
        # end

        render json: {
            appointments: appointments, 
            consults: consults, 
            }
    end

    def getUsersBookedEvents
        user = User.find(params["id"])
        begin
            appointments = eventsInDateWindow(@appointmentsCal).select{|a| doAnyAttendeesHaveThisEmail(user.email, a.attendees)}
            rescue
            appointments = []    
        end

        begin
            consults = eventsInDateWindow(@consultsCal).select{|a| doAnyAttendeesHaveThisEmail(current_user.email, a.attendees)}
            rescue
            consults = []    
        end

        render json: {
            events: appointments + consults
            # appointments: appointments, 
            # consults: consults, 
            }
    end

    def eventsInDateWindow(cal)
        now = DateTime.now()
        oneMonthAgo = now << 1
        sixMonthsAhead = now >> 6
        cal.find_events_in_range(oneMonthAgo,sixMonthsAhead, options = {max_results: 2500})
    end



    def getPublicEvents
        begin
            appointments = futureEvents(@appointmentsCal,100).select{|a| !a.attendees}
            rescue
            appointments = []    
        end

         begin
            consults = futureEvents(@consultsCal, 100).select{|a| !a.attendees}
            rescue
            consults = []    
        end

        render json: {
            appointments: appointments, 
            consults: consults, 
            }
    end

    def futureEvents(cal, maxResults)
        cal.find_future_events(options = {max_results: maxResults, expand_recurring_events: true })
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
        # render json: {canceledEvent: event}

        return editGoogleCalEvent(cal: cal, event: event, attendees: attendees, inGracePeriod: inGracePeriod)
    end

def editGoogleCalEvent(cal:, event:, attendees: [], inGracePeriod: true, recurrence: nil)


        
        editedEvent = cal.find_or_create_event_by_id(event["id"]) do |e|
            
            e.title = event["title"]
            e.color_id = 2
            e.start_time = event["start_time"]
            e.end_time = event["end_time"]
            e.location= event["location"]
            e.attendees = attendees
            e.recurrence = recurrence ? {freq: recurrence["freq"], count: 50} : nil

            begin
             e.extended_properties = {'private' => {
                'paid' => event["extended_properties"]["private"]["paid"],
                 'stripe_id' => event["extended_properties"]["private"]["stripe_id"],
                 'cancelation' => inGracePeriod === false ? "true" : "false",
                 'skype' => event["extended_properties"]["private"]["skype"] || false
                }}
            rescue
                e.extended_properties = {'private' => {
                'paid' => false,
                 'stripe_id' => "",
                 'cancelation' => inGracePeriod === false ? "true" : "false",
                }}
            end
        end
        render json: {editedEvent: editedEvent}
    end

    def getScheduleEvents

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

        render json: { events: appointments + consults}
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
            return createGoogleEvent(cal: @appointmentsCal,newEvent: newEvent, title: "Appointment Slot", recurrence:  newEvent["recurrence"])
        end
        if params["consultSlot"]
            return createGoogleEvent(cal: @consultsCal,newEvent: newEvent, title: "Consult Slot", recurrence:  newEvent["recurrence"])
        end
        # if booked appointment
        return createGoogleEvent(cal: @appointmentsCal, newEvent: newEvent, title: title, attendees: attendees, recurrence:  newEvent["recurrence"])
    end


    def createGoogleEvent(cal:, newEvent:, title:, attendees: [], recurrence: nil)
        event = cal.create_event do |e|
            e.title = title
            e.start_time = newEvent["start_time"]
            e.end_time = newEvent["end_time"]
            e.location= newEvent["location"]
            e.reminders =  { "useDefault": false }
            e.attendees= attendees
            e.recurrence = recurrence ? {freq: recurrence["freq"], count: 50} : nil
            e.extended_properties = {'private' => {'paid' => false, 'stripe_id' => "", 'skype' => newEvent["extended_properties"]["private"]["skype"] || false}}
        end
       
        #  render json: {, events: eventsInDateWindow(@appointmentsCal), personalEvents: @personalCal ? eventsInDateWindow(@personalCal) : [] }
        render json: {newEvent: event}
    end

    def deleteEvent
         event = params["event"]
         deleteFutureReps = params["deleteFutureReps"]
         deleteAllReps = params["deleteFutureReps"]

        if event["calendar"]["id"] === current_user.google_calendar_email
                cal = @personalCal
        end

        if event["calendar"]["id"] === ENV["APPOINTMENTS_CALENDAR_ID"]
            cal = @appointmentsCal
        end

        if event["calendar"]["id"] === ENV["CONSULTS_CALENDAR_ID"]
            cal = @consultsCal
        end
        
        results = cal.find_event_by_id(event["id"])

        foundEvent = results.first

        # delete future reps
        if foundEvent.raw["recurringEventId"]
            if deleteFutureReps

                start = DateTime.parse(foundEvent.start_time)
                twoYearsAhead = start >> 24
                futureEvents = cal.find_events_in_range(start, twoYearsAhead, options = {max_results: 2500})
                futureReps = futureEvents.select{ |e| e.raw["recurringEventId"] === foundEvent.raw["recurringEventId"]}
                futureReps.each {|r| r.delete}
                # foundEvent.delete
                 return appStateJson()
            end

            if deleteAllReps
                allEvents = eventsInDateWindow(cal)
                repeats = allEvents.select{ |e| e.raw["recurringEventId"] === foundEvent.raw["recurringEventId"]}
                repeats.each {|r| r.delete}
                # foundEvent.delete
                return appStateJson()
            end

            
        end

        foundEvent.delete
        render json: {deletedEvent: foundEvent}
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
                return editGoogleCalEvent(cal: @personalCal, event: event, recurrence:  event["recurrence"])
        end

        # business
        if event["calendar"]["id"] === ENV["APPOINTMENTS_CALENDAR_ID"]
                return editGoogleCalEvent(cal: @appointmentsCal, event: event, attendees: attendees, recurrence:  event["recurrence"])
        end

        if event["calendar"]["id"] === ENV["CONSULTS_CALENDAR_ID"]
                return editGoogleCalEvent(cal: @consultsCal, event: event, attendees: attendees, recurrence:  event["recurrence"])
        end
    end

    def remove_many_stripe_ids
        invoiceItems = params["invoice"]["lines"]["data"]
        cal = nil
        invoiceItems.each do |item|
            if item["metadata"]["type"] === "Appointment"
                cal = @appointmentsCal
            end
            if item["metadata"]["type"] === "Consult"
                cal = @consultsCal
            end

            foundItems = cal.find_events_by_extended_properties({ 'private' => {'stripe_id' => item["id"]} })

            foundItems.each do |item|
                item.extended_properties = {'private' => {'paid' => false, 'stripe_id' => "", 'skype' => item.extended_properties = {'private' => {'paid' => false, 'stripe_id' => "", 'skype' => item.extended_properties["private"]["skype"] || false}}}}
                item.save
            end
        end

        render json: {success: true}

        
    end

    def remove_stripe_id_from_event
        invoice_item = params["invoice_item"]["metadata"]

        cal = nil


        if invoice_item["type"] === "Appointment"
            cal = @appointmentsCal
        end
        if invoice_item["type"] === "Phone Consult"
            cal = @appointmentsCal
        end
        
        editedEvent = cal.find_or_create_event_by_id(invoice_item["google_event_id"]) do |e|

            e.extended_properties = {'private' => {'paid' => e.extended_properties["private"]["paid"], 'stripe_id' => ""}}
        end

        render json: {editedEvent: editedEvent}
    end

end