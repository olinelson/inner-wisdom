Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: "users/registrations",passwords: "users/passwords" }
  

  # pages
  root to: 'pages#home'
  get "/clients/:id" => 'pages#clientShow'
  get "/counselling" => "pages#counselling"
  get "/faqs" => "pages#faqs"
  get "/contact" => "pages#contact"
  get "/supervision" => "pages#supervision"
  get "/appointments" => "pages#appointments"
  get "/myaccount" => "pages#myAccount"
  get "/schedule" => "pages#schedule"
  get "/clients" => "pages#clients"
  get "/fees" => "pages#fees"
  get "/blog" => "pages#blog"
  get "/posts/:id" => "pages#showPost"

  
  post '/api/v1/remove_stripe_id_from_event'=> 'googlecal#remove_stripe_id_from_event' 
  post '/api/v1/remove_many_stripe_ids'=> 'googlecal#remove_many_stripe_ids'


  get "/api/v1/events/public/:calStart/:calEnd" => "googlecal#getPublicEvents"
  get "/api/v1/events/schedule/:calStart/:calEnd" => "googlecal#getScheduleEvents"
  get "/api/v1/events/current_user/:calStart/:calEnd" => "googlecal#getUsersAndFreeEvents"
  get "/api/v1/api/v1/events/booked/:id" => "googlecal#getUsersBookedEvents"
  
  
  post '/api/v1/events/book'=> 'googlecal#bookEvent'
  post '/api/v1/events/cancel'=> 'googlecal#cancelEvent'  
  post '/api/v1/events/create'=> 'googlecal#createEvent'  
  post '/api/v1/events/delete'=> 'googlecal#deleteEvent'  
  post '/api/v1/events/delete_event_repeats'=> 'googlecal#deleteEventRepeats'  
  post '/api/v1/events/update'=> 'googlecal#updateEvent'  

 

  # google personal cal set up
  post '/api/v1/googlecal/url'=> 'googlecal#genNewCalAuthUrl'
  post '/api/v1/googlecal/token'=> 'googlecal#setPersonalCalRefreshToken'


  # users
   devise_scope :user do
    post "/api/v1/clients" => 'users/registrations#create_user_with_admin'
    patch "/api/v1/clients/:id" => 'users/registrations#edit_user_with_admin'
    delete "/api/v1/clients/:id" => 'users/registrations#destroy_with_admin'
  end


 

  # stripe
  post "/api/v1/stripe/invoice_items" => "stripe#get_customer_invoice_items"
  post "/api/v1/stripe/invoice_items/create" => "stripe#create_invoice_item"
  post "/api/v1/stripe/invoice_items/delete" => "stripe#delete_invoice_item"
  patch "/api/v1/stripe/invoice_items" => "stripe#update_invoice_item"
  post "/api/v1/stripe/invoices" => "stripe#get_customer_invoices"
  post "/api/v1/stripe/invoices/send" => "stripe#send_invoice"
  post "/api/v1/stripe/invoices/new" => "stripe#create_invoice"
  post "/api/v1/stripe/invoices/void" => "stripe#void_invoice"
  post "/api/v1/stripe/invoices/delete" => "stripe#delete_draft_invoice"
  post "/api/v1/stripe/invoices/mark_as_paid" => "stripe#mark_invoice_as_paid"
  




 # blog post routes
  get "api/v1/posts/published" => "posts#getAllPublishedPosts"
  get "api/v1/posts" => "posts#getAllPosts"
  
  patch '/posts/:id'=> 'posts#edit'
  delete '/posts/:id'=> 'posts#delete'
  post '/api/v1/posts'=> 'posts#create'
  post '/api/v1/attach/posts/:id'=> 'posts#attach_feature_image'
  post '/api/v1/insert/posts/:id' => 'posts#upload_image'




end