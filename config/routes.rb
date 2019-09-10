Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: "users/registrations",passwords: "users/passwords" }
  root to: 'pages#home'

  # calendar event routes
  # post '/getEvents', to: 'main#getEvents'
  post '/create', to: 'main#createEvent'
  delete '/delete', to: 'main#deleteEvent'
  post '/update', to: 'main#updateEvent'
  # post '/cancel', to: 'main#cancelEvent'
  # post '/purchase', to: 'main#purchase'
  post '/calendar_auth', to: 'main#calendarAuthLink'
  
  post '/remove_stripe_id_from_event', to: 'main#remove_stripe_id_from_event' 
  post '/remove_many_stripe_ids', to: 'main#remove_many_stripe_ids'


  get "/events/public" => "googlecal#getPublicEvents"
  get "/events/current_user" => "googlecal#getUsersAndFreeEvents"
  get "/events/booked/:id" => "googlecal#getUsersBookedEvents"
  post '/events/book', to: 'googlecal#bookEvent'
  post '/events/cancel', to: 'googlecal#cancelEvent'  

 

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
  post "/stripe/invoices/mark_as_paid" => "stripe#mark_invoice_as_paid"
  




 # blog post routes
  get "/blog" => "posts#getAllPublishedPosts"
  get "/posts/:id" => "posts#showPost"
  patch '/posts/:id', to: 'posts#edit'
  delete '/posts/:id', to: 'posts#delete'
  post '/posts', to: 'posts#create'
  post '/attach/posts/:id', to: 'posts#attach'

  # pages
  get "/counselling" => "pages#counselling"
  get "/faqs" => "pages#faqs"
  get "/contact" => "pages#contact"
  get "/supervision" => "pages#supervision"
  get "/appointments" => "pages#appointments"
  get "/myaccount" => "pages#myAccount"
  # my account
  

end