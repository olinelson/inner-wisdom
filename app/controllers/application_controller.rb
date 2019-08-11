class ApplicationController < ActionController::Base
    before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [
      :first_name, 
      :last_name,
      :street_address, 
      :apartment_number,
      :suburb,
      :state,
      :post_code,
      :phone_number

      ])
    devise_parameter_sanitizer.permit(:account_update, keys: [
      :first_name, 
      :last_name, 
      :google_calendar_email, 
      :google_calendar_refresh_token,
      :street_address, 
      :apartment_number,
      :suburb,
      :state,
      :post_code,
      :phone_number,
      ])

  end
end
