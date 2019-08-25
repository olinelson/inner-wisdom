Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: "users/registrations",passwords: "users/passwords" }
  root to: 'main#home'

  # calendar event routes
  post '/create', to: 'main#createEvent'
  delete '/delete', to: 'main#deleteEvent'
  post '/update', to: 'main#updateEvent'
  post '/cancel', to: 'main#cancelEvent'
  post '/purchase', to: 'main#purchase'
  post '/calendar_auth', to: 'main#calendarAuthLink'
  
  post '/remove_stripe_id_from_event', to: 'main#remove_stripe_id_from_event' 
  post '/remove_many_stripe_ids', to: 'main#remove_many_stripe_ids'

  




  # blog post routes
  patch '/posts/:id', to: 'posts#edit'
  delete '/posts/:id', to: 'posts#delete'
  post '/posts', to: 'posts#create'
  post '/attach/posts/:id', to: 'posts#attach'


  # google personal cal set up
  post '/googlecal/url', to: 'googlecal#genNewCalAuthUrl'
  post '/googlecal/token', to: 'googlecal#setPersonalCalRefreshToken'


  # users
   devise_scope :user do
    post "/clients" => 'users/registrations#create_user_with_admin'
    patch "/clients/:id" => 'users/registrations#edit_user_with_admin'
    delete "/clients/:id" => 'users/registrations#destroy_with_admin'
  end

  # stripe


  # get "/stripe/users/:user_id" => 'stripe#create_customer/' , :as => :create_customer
  post "/stripe/invoice_items" => "stripe#get_customer_invoice_items"
  post "/stripe/invoice_items/create" => "stripe#create_invoice_item"
  post "/stripe/invoice_items/delete" => "stripe#delete_invoice_item"
  patch "/stripe/invoice_items" => "stripe#update_invoice_item"
  post "/stripe/invoices" => "stripe#get_customer_invoices"
  post "/stripe/invoices/send" => "stripe#send_invoice"
  post "/stripe/invoices/new" => "stripe#create_invoice"
  post "/stripe/invoices/void" => "stripe#void_invoice"
  post "/stripe/invoices/delete" => "stripe#delete_draft_invoice"
  



end