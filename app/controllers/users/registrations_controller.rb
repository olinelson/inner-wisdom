# frozen_string_literal: true


class Users::RegistrationsController < Devise::RegistrationsController
  prepend_before_action :require_no_authentication, only: [:new, :create, :cancel]
  prepend_before_action :authenticate_scope!, only: [:edit, :update, :destroy]
  prepend_before_action :set_minimum_password_length, only: [:new, :edit]

  # GET /resource/sign_up
  def new
    build_resource
    yield resource if block_given?
    respond_with resource
  end

  def create_user_with_admin
    if current_user.admin 
      params.permit(:sendWelcomeEmail)
    build_resource(sign_up_params)
   
    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?

        if params["user"]["sendWelcomeEmail"]
        resource.send_reset_password_instructions
        NotificationMailer.account_created_by_admin_notification(resource).deliver_later
       end
       
       begin
          Stripe.api_key = ENV["STRIPE_KEY"]
          customer =  Stripe::Customer.create({
          name: resource.first_name + " " + resource.last_name,
          email: resource.email,
          phone: resource.phone_number
          })


          if customer.id
          resource.update(stripe_id: customer.id)
          end
        rescue
          puts "Stripe customer creation error"
        end


       render json: {newUser: resource}
      end
    end
    end

    
  end

  # POST /resource
  def create
    
    params.permit(:sendWelcomeEmail, :createdByAdmin)

    if params["user"]["createdByAdmin"]
      return create_user_with_admin
    end

    build_resource(sign_up_params)
    
    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)

        begin
          Stripe.api_key = ENV["STRIPE_KEY"]
          customer =  Stripe::Customer.create({
          name: resource.first_name + " " + resource.last_name,
          email: resource.email,
          phone: resource.phone_number
          })

          if customer.id
          resource.update(stripe_id: customer.id)
          end
        rescue
          puts "Stripe customer creation error"
        end
      
        respond_with resource, location: after_sign_up_path_for(resource)

        
      else
        set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_in!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end

  end


  # GET /resource/edit
  def edit
    render :edit
  end

  def edit_user_with_admin
    if current_user.admin
       user = User.find(params["id"])

      user.update(account_update_params)


      begin
       Stripe.api_key = ENV["STRIPE_KEY"]
          customer =  Stripe::Customer.retrieve(user.stripe_id)

          if customer
            Stripe::Customer.update(
            customer.id,
            {
            email: user.email,
            phone: user.phone_number,
            name: user.first_name + " " + user.last_name,
            }
            )
          end
        rescue
          puts "Stripe Update Customer Error" 
        end


    end
    render json: {user: user}
  end
  # PUT /resource
  # We need to use a copy of the resource because we don't want to change
  # the current user in place.
  def update
    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)

    resource_updated = update_resource(resource, account_update_params)
    yield resource if block_given?
    if resource_updated

      begin
       Stripe.api_key = ENV["STRIPE_KEY"]
          customer =  Stripe::Customer.retrieve(resource.stripe_id)

          if customer
            Stripe::Customer.update(
            customer.id,
            {
            email: resource.email,
            phone: resource.phone_number,
            name: resource.first_name + " " + resource.last_name,
            }
            )
          end
        rescue
          puts "Stripe Update Customer Error" 
        end


      set_flash_message_for_update(resource, prev_unconfirmed_email)
      bypass_sign_in resource, scope: resource_name if sign_in_after_change_password?

      respond_with resource, location: after_update_path_for(resource)
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end
  end

  # DELETE /resource
  def destroy
    begin
    Stripe.api_key = ENV["STRIPE_KEY"]
    Stripe::Customer.delete(resource.stripe_id)
    rescue 
      puts "Delete stripe customer error"
    end

    resource.destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    set_flash_message! :notice, :destroyed
    yield resource if block_given?
    respond_with_navigational(resource){ redirect_to after_sign_out_path_for(resource_name) }
  end

  def destroy_with_admin
    if current_user.admin
      user = User.find(params["id"])
      begin
      Stripe.api_key = ENV["STRIPE_KEY"]
      Stripe::Customer.delete(user.stripe_id)
      rescue 
        puts "Delete stripe customer error"
      end
      user.destroy
    end

    set_flash_message! :notice, :destroyed


    render json: {users: User.all}
  end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  def cancel
    expire_data_after_sign_in!
    redirect_to new_registration_path(resource_name)
  end

  protected

  def update_needs_confirmation?(resource, previous)
    resource.respond_to?(:pending_reconfirmation?) &&
      resource.pending_reconfirmation? &&
      previous != resource.unconfirmed_email
  end

  # By default we want to require a password checks on update.
  # You can overwrite this method in your own RegistrationsController.
  def update_resource(resource, params)
    resource.update_with_password(params)
  end

  # Build a devise resource passing in the session. Useful to move
  # temporary session data to the newly created user.
  def build_resource(hash = {})
    self.resource = resource_class.new_with_session(hash, session)
  end

  # Signs in a user on sign up. You can overwrite this method in your own
  # RegistrationsController.
  def sign_up(resource_name, resource)
    sign_in(resource_name, resource)
  end

  # The path used after sign up. You need to overwrite this method
  # in your own RegistrationsController.
  def after_sign_up_path_for(resource)
    after_sign_in_path_for(resource) if is_navigational_format?
  end

  # The path used after sign up for inactive accounts. You need to overwrite
  # this method in your own RegistrationsController.
  def after_inactive_sign_up_path_for(resource)
    scope = Devise::Mapping.find_scope!(resource)
    router_name = Devise.mappings[scope].router_name
    context = router_name ? send(router_name) : self
    context.respond_to?(:root_path) ? context.root_path : "/"
  end

  # The default url to be used after updating a resource. You need to overwrite
  # this method in your own RegistrationsController.
  def after_update_path_for(resource)
    sign_in_after_change_password? ? signed_in_root_path(resource) : new_session_path(resource_name)
  end

  # Authenticates the current scope and gets the current resource from the session.
  def authenticate_scope!
    send(:"authenticate_#{resource_name}!", force: true)
    self.resource = send(:"current_#{resource_name}")
  end

  def sign_up_params
    devise_parameter_sanitizer.sanitize(:sign_up)
  end

  def account_update_params
    devise_parameter_sanitizer.sanitize(:account_update)
  end

  def translation_scope
    'devise.registrations'
  end

  private

  def set_flash_message_for_update(resource, prev_unconfirmed_email)
    return unless is_flashing_format?

    flash_key = if update_needs_confirmation?(resource, prev_unconfirmed_email)
                  :update_needs_confirmation
                elsif sign_in_after_change_password?
                  :updated
                else
                  :updated_but_not_signed_in
                end
    set_flash_message :notice, flash_key
  end

  def sign_in_after_change_password?
    return true if account_update_params[:password].blank?

    Devise.sign_in_after_change_password
  end
end