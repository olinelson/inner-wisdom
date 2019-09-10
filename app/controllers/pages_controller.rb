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

    def appointments
        render react_component: 'Appointments', props: {current_user: current_user}
    end

    def myAccount
        render react_component: 'MyAccount', props: {current_user: current_user}

    end
    def schedule
        if current_user.admin
            render react_component: 'Schedule', props: {current_user: current_user, users: User.where("admin = false").order(:first_name)}
        else
        redirect_to appointments_url and return
        end
        
    end
end
