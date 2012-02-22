CarrierwaveJqueryFileUpload::Application.routes.draw do
  resources :pictures

  resources :cities do
    collection do
      get 'latest'
      get 'interactive'
    end
    member do
      get 'interactive'
      get 'mosaic'
    end
    resources :pictures
    resources :mosaics do
      collection do
      	get 'generate'
        get 'latest'
      end
    end
  end

  resources :mosaics do
    resources :pictures
    collection do
      get 'latest'
    end
  end

  root :to => 'cities#interactive'

  # customization for serving facebook's channel file
  get '/channel.html' => proc {
    [
      200,
      {
        'Pragma'        => 'public',
        'Cache-Control' => "max-age=#{1.year.to_i}",
        'Expires'       => (Time.now + 1.year ).strftime("%d %m %Y %H:%I:%S %Z"),
        'Content-Type'  => 'text/html'
      },
      ['<script type="text/javascript" src="//connect.facebook.net/en_US/all.js"></script>']
    ]
  }
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
