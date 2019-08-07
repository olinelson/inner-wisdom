class NotificationMailer < ApplicationMailer
    

    def prettyTime
        DateTime.parse(@event.start_time).strftime("%A, %d %b %Y %l:%M %p") + " till " + DateTime.parse(@event.end_time).strftime(" %l:%M %p")
    end

    def user_appointment_confirmation(user, event)
        @user = user
        @event = event
        @time = prettyTime

        mail(to: @user.email, subject: 'Booking Confirmation')
    end

    def admin_appointment_confirmation(user, event)
        @user = user
        @event = event
        @time = prettyTime
        mail(to: ENV["EMAIL_ADDRESS"], subject: 'Booking Confirmation')

    end


end
