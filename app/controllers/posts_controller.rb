class PostsController < ApplicationController
    def edit
        @post = Post.find(params[:id])
        editedPost = params[:editedPost]
        @post.update(body: editedPost["body"], published: editedPost["published"], title: editedPost["title"])
        render json: {posts: Post.all} 
    end

    def create
        @post = Post.create(user_id: current_user.id)
        @post.save
        render json: {newPost: @post} 

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

     def getAllPublishedPosts
         render json: {posts: Post.all.select{|p| p.published === true}}
    end

     def getAllPosts
        render json:  { posts: Post.all.order("created_at DESC")}
    end

    def showPost
        render react_component: 'PostEditor', props: { 
            post: Post.find(params["id"]),
            current_user: current_user  
        }
    end
end