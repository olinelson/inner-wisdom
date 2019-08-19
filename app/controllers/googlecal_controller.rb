class GooglecalController < ApplicationController
    def genNewCalAuthUrl 

        newEmail = params["newPersonalEmail"] + "@gmail.com"
        cal = Google::Calendar.new(
                    :client_id     => ENV['GOOGLE_CLIENT_ID'], 
                    :client_secret => ENV['GOOGLE_CLIENT_SECRET'],
                    :calendar      => newEmail,
                    :redirect_url  => ENV['GOOGLE_REDIRECT_URL']
                                    ) 


        authUrl = cal.authorize_url.to_str   
        render json: { authUrl: authUrl }                        

    end

    def setPersonalCalRefreshToken
        newEmail = params["newPersonalEmail"] + "@gmail.com"
        authCode = params["authCode"]
        user = current_user
        cal = Google::Calendar.new(
                    :client_id     => ENV['GOOGLE_CLIENT_ID'], 
                    :client_secret => ENV['GOOGLE_CLIENT_SECRET'],
                    :calendar      => newEmail,
                    :redirect_url  => ENV['GOOGLE_REDIRECT_URL']
                                    ) 
         
        
        refresh_token = cal.login_with_auth_code(authCode)   
        user.google_calendar_email = newEmail
        user.google_calendar_refresh_token = refresh_token
        user.save

        render json: {status: "success"}
    end
end