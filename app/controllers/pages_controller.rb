class PagesController < ApplicationController
    def counselling
         render react_component: 'Counselling'
    end

    def supervision
        render react_component: 'Supervision'
    end

    def faqs
        render react_component: 'FAQS'
    end

    def contact
        render react_component: 'Contact'
    end

    def home
        render react_component: 'Home' ,props: { 
           lastPost: Post.all.select{|p| p.published === true}.last
        } 
        
    end
end
