class PagesController < ApplicationController
    before_action :authenticate_user! , except: [:counselling, :supervision, :faqs, :contact, :home, :appointments, :blog, :fees]


    def counselling
         render react_component: 'Counselling'
    end

    def supervision
        render react_component: 'Supervision'
    end

    def faqs
        render react_component: 'FAQS'
    end
    def fees
        render react_component: 'Fees'
    end

    def contact
        render react_component: 'Contact'
    end

    def home
        lastPost = Post.order("created_at DESC").where("published = true").first
        render react_component: 'Home' ,props: { 
            lastPost: lastPost
        } 
    end

    def appointments
        if current_user && current_user.admin
            redirect_to schedule_url and return
        end
        render react_component: 'Appointments', props: {current_user: current_user}
    end

    def myAccount
        render react_component: 'MyAccount', props: {current_user: current_user}

    end
    def schedule
        if current_user && current_user.admin
            render react_component: 'Schedule', props: {current_user: current_user, users: User.where("admin = false").order(:first_name)}
        else
        redirect_to appointments_url and return
        end
    end

    def clients
        if current_user && current_user.admin
            render react_component: 'Clients', props: {current_user: current_user, users: User.where("admin = false").order(:first_name)}
        else
        redirect_to appointments_url and return
        end
    end

    def clientShow
        if current_user && current_user.admin
            user = User.find(params["id"])
            render react_component: 'ClientShowApp', props: {current_user: current_user, user: user}
        else
        redirect_to myaccount_url and return
        end
    end

    def blog
        render react_component: 'Blog', props: {current_user: current_user}
    end
end
