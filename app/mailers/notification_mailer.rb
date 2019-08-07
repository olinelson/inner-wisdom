class NotificationMailer < ApplicationMailer

    def appointment_confirmation(user, event)
        @user = user
        @event = event
         mail(to: @user.email, subject: 'Booking Confirmation')
    end

    def newSignUp
    end

end
