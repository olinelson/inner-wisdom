class PostsController < ApplicationController
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
         render json: {posts: Post.select{|p| p.published === true}}
    end

     def getAllPosts
        render json:  { posts: Post.order("created_at DESC")}
    end

    def showPost
        render react_component: 'PostEditor', props: { 
            post: Post.find(params["id"]),
            current_user: current_user  
        }
    end
end