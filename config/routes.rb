Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: "users/registrations",passwords: "users/passwords" }
  root to: 'pages#home'

  
  post '/remove_stripe_id_from_event'=> 'googlecal#remove_stripe_id_from_event' 
  post '/remove_many_stripe_ids'=> 'googlecal#remove_many_stripe_ids'


  get "/events/public/:calStart/:calEnd" => "googlecal#getPublicEvents"
  get "/events/schedule/:calStart/:calEnd" => "googlecal#getScheduleEvents"
  get "/events/current_user/:calStart/:calEnd" => "googlecal#getUsersAndFreeEvents"
  get "/events/booked/:id" => "googlecal#getUsersBookedEvents"
  post '/events/book'=> 'googlecal#bookEvent'
  post '/events/cancel'=> 'googlecal#cancelEvent'  
  post '/events/create'=> 'googlecal#createEvent'  
  post '/events/delete'=> 'googlecal#deleteEvent'  
  post '/events/update'=> 'googlecal#updateEvent'  

 

  # google personal cal set up
  post '/googlecal/url'=> 'googlecal#genNewCalAuthUrl'
  post '/googlecal/token'=> 'googlecal#setPersonalCalRefreshToken'


  # users
   devise_scope :user do
    post "/clients" => 'users/registrations#create_user_with_admin'
    patch "/clients/:id" => 'users/registrations#edit_user_with_admin'
    delete "/clients/:id" => 'users/registrations#destroy_with_admin'
  end
  get "/clients/:id" => 'pages#clientShow'

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
  get "/posts/published" => "posts#getAllPublishedPosts"
  get "/posts" => "posts#getAllPosts"
  get "/posts/:id" => "posts#showPost"
  patch '/posts/:id'=> 'posts#edit'
  delete '/posts/:id'=> 'posts#delete'
  post '/posts'=> 'posts#create'
  post '/attach/posts/:id'=> 'posts#attach_feature_image'

  post '/insert/posts/:id' => 'posts#upload_image'

  # pages
  get "/counselling" => "pages#counselling"
  get "/faqs" => "pages#faqs"
  get "/contact" => "pages#contact"
  get "/supervision" => "pages#supervision"
  get "/appointments" => "pages#appointments"
  get "/myaccount" => "pages#myAccount"
  get "/schedule" => "pages#schedule"
  get "/clients" => "pages#clients"
  get "/blog" => "pages#blog"
  # my account
  

end