class PostsController < ApplicationController
    def edit
        @post = Post.find(params[:id])
        newPost = params[:post]
        @post.update(body: newPost["body"], published: newPost["published"], title: newPost["title"])
        render json: {posts: Post.all} 
    end

    def create
        @post = Post.create(user_id: current_user.id)
        @post.save
        render json: {posts: Post.all} 

    end

    def delete
        @post = Post.find(params[:id])
        @post.delete
        render json: {posts: Post.all} 
    end

    def attach
     @post = Post.find(params[:id])
     @post.image.attach(params["file"])
     feature_image = "https://storage.googleapis.com/inner_wisdom_bucket/#{@post.image.key}"
    @post.feature_image = feature_image
    @post.save
    render json: {posts: Post.all, feature_image: feature_image} 
    end
end