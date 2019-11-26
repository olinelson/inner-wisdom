class PostsController < ApplicationController
   before_action :authenticate_user! , except: [:showPost, :getAllPublishedPosts]
   before_action :isAdmin, except: [:showPost, :getAllPublishedPosts]
   
   def isAdmin
        if !current_user.admin
            redirect_to blog_path and return
        end
    end

    def edit
        @post = Post.find(params[:id])
        editedPost = params[:editedPost]
        @post.update(body: editedPost["body"], published: editedPost["published"], title: editedPost["title"])
        render json: {editedPost: @post} 
    end

    def create
        @post = Post.create(user_id: current_user.id)
        @post.save
        render json: {newPost: @post} 

    end

    def delete
        @post = Post.find(params[:id])
        @post.delete
        render json: {deletedPost: @post} 
    end

    def upload_image
        @post = Post.find(params[:id])
        @post.images.attach(params["file"])
        src = "https://storage.googleapis.com/inner_wisdom_bucket/#{@post.images.last.key}"
        @post.save
        render json: {src: src} 
    end

    def attach_feature_image
     @post = Post.find(params[:id])
     @post.images.attach(params["file"])
     feature_image = "https://storage.googleapis.com/inner_wisdom_bucket/#{@post.images.last.key}"
    @post.feature_image = feature_image
    @post.save
    render json: {editedPost: @post} 
    end

     def getAllPublishedPosts
        posts = Post.order("created_at DESC")
        posts = posts.select{|p| p.published === true}
        render json: {posts: posts}
    end

    def getAllPosts
        render json:  { posts: Post.order("created_at DESC")}
    end

   
end