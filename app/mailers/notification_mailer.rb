class NotificationMailer < ApplicationMailer
    
    

    def prettyTime(time_zone)
        begin
            if @event["start_time"]
                return DateTime.parse(@event["start_time"]).in_time_zone(time_zone).strftime("%A, %d %b %Y %l:%M %p") + " till " + DateTime.parse(@event["end_time"]).in_time_zone(time_zone).strftime(" %l:%M %p")
            end
            # all day
            if @event["start"]["date"]
                return DateTime.parse(@event["start"]["date"]).in_time_zone(time_zone).strftime("%A, %d %b %Y") + " | All Day Event"
            end

            if @event["start"]["dateTime"]
                return DateTime.parse(@event["start"]["dateTime"]).in_time_zone(time_zone).strftime("%A, %d %b %Y %l:%M %p") + " till " + DateTime.parse(@event["end"]["dateTime"]).in_time_zone("Sydney").strftime(" %l:%M %p")  
            end
        rescue
            return "Invalid Date"
        end
    end


    def user_appointment_cancelation(user,event)
        @user = user
        @event = JSON.parse(event)
        
         @time = prettyTime(@user.time_zone)

        mail(to: @user.email, subject: 'Appointment Canceled')
    end
    
    def admin_appointment_cancelation(user,event)
        @user = user
        @event = JSON.parse(event)
        @time =  prettyTime(@user.time_zone)

        mail(to: ENV["EMAIL_ADDRESS"], subject: 'Appointment Canceled')
    end

    def user_appointment_confirmation(user, event)
        @user = user
        @event = JSON.parse(event)

        @time =  prettyTime(@user.time_zone)

        mail(to: @user.email, subject: 'Booking Confirmation')
    end

    def user_consult_confirmation(user, event)
        @user = user
        @event = JSON.parse(event)
        @time =  prettyTime(@user.time_zone)

        mail(to: @user.email, subject: 'Booking Confirmation')
    end

    def admin_appointment_confirmation(user, event)
        @user = user
        @event = JSON.parse(event)
        @time =  prettyTime(@user.time_zone)

        mail(to: ENV["EMAIL_ADDRESS"], subject: 'Booking Confirmation')
    end

    def admin_consult_confirmation(user, event)
        @user = user
        @event = JSON.parse(event)
        @time =  prettyTime(@user.time_zone)
        mail(to: ENV["EMAIL_ADDRESS"], subject: 'Booking Confirmation')

    end

    def account_created_by_admin_notification(user)
        @user = user
        mail(to: @user.email, subject: 'Welcome To Inner Wisdom')
    end


end
