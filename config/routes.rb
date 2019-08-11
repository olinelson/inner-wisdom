Rails.application.routes.draw do

  # devise_for :users
  devise_for :users, controllers: { registrations: "users/registrations",passwords: "users/passwords" }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'main#home'

  post '/create', to: 'main#createEvent'

  delete '/delete', to: 'main#deleteEvent'

  post '/update', to: 'main#updateEvent'
  
  post '/purchase', to: 'main#purchase'

  post '/calendar_auth', to: 'main#calendarAuthLink'

  # get '/pay', to: 'payment#pay'

  patch '/posts/:id', to: 'posts#edit'

  delete '/posts/:id', to: 'posts#delete'

  post '/posts', to: 'posts#create'

  post '/attach/posts/:id', to: 'posts#attach'

  post '/googlecal/url', to: 'googlecal#genNewCalAuthUrl'

  post '/googlecal/token', to: 'googlecal#setPersonalCalRefreshToken'

  # post '/clients', to: 'users/registrations#create_user_with_admin'
   devise_scope :user do
    post "/clients" => 'users/registrations#create_user_with_admin'

    patch "/clients/:id" => 'users/registrations#edit_user_with_admin'

    delete "/clients/:id" => 'users/registrations#destroy_with_admin'
  end

  

  

  # get '/posts/create', to: 'posts#create'

end