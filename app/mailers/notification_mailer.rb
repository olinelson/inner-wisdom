class NotificationMailer < ApplicationMailer
    
    

    def prettyTime
        DateTime.parse(@event["start_time"]).strftime("%A, %d %b %Y %l:%M %p") + " till " + DateTime.parse(@event["end_time"]).strftime(" %l:%M %p")
    end

    def alternatePrettyTime
         DateTime.parse(@event["start"]["dateTime"]).strftime("%A, %d %b %Y %l:%M %p") + " till " + DateTime.parse(@event["end"]["dateTime"]).strftime(" %l:%M %p")
    end

    def user_appointment_cancelation(user,event)
        @user = user
        @event = JSON.parse(event)
        
        if @event["start_time"]
            @time = prettyTime
        end
        if @event["start"]
            @time = alternatePrettyTime
        end

        mail(to: @user.email, subject: 'Appointment Canceled')
    end

    def user_appointment_confirmation(user, event, eventLink)
        @eventLink = eventLink
        @user = user
        @event = JSON.parse(event)

        @time = prettyTime
        mail(to: @user.email, subject: 'Booking Confirmation')
    end

    def user_consult_confirmation(user, event)
        @user = user
        @event = JSON.parse(event)

        if @event["start_time"]
            @time = prettyTime
        end
        if @event["start"]
            @time = alternatePrettyTime
        end
        mail(to: @user.email, subject: 'Booking Confirmation')
    end

    def admin_appointment_confirmation(user, event)
        @user = user
        @event = JSON.parse(event)
        @time = alternatePrettyTime
        mail(to: ENV["EMAIL_ADDRESS"], subject: 'Booking Confirmation')
    end

    def admin_consult_confirmation(user, event)
        @user = user
        @event = JSON.parse(event)
        @time = alternatePrettyTime
        mail(to: ENV["EMAIL_ADDRESS"], subject: 'Booking Confirmation')

    end

    def account_created_by_admin_notification(user)
        @user = user
        mail(to: @user.email, subject: 'Welcome To Inner Wisdom')
    end


end
