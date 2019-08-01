Rails.application.routes.draw do

  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'main#home'

  get '/refresh', to: 'main#refresh'

  post '/create', to: 'main#createEvent'

  delete '/delete', to: 'main#deleteEvent'
  
  post '/edit', to: 'main#editEvent'

  post '/calendar_auth', to: 'main#calendarAuthLink'

  get '/pay', to: 'payment#pay'

  patch '/posts/:id', to: 'posts#edit'

  delete '/posts/:id', to: 'posts#delete'

  post '/posts', to: 'posts#create'

  post '/attach/posts/:id', to: 'posts#attach'

  

  

  # get '/posts/create', to: 'posts#create'

end