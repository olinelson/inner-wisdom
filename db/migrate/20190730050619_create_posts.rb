class CreatePosts < ActiveRecord::Migration[5.2]
  def change
    create_table :posts do |t|
      t.string :title , :default => "New Post"
      t.text :body
      t.integer :user_id
      t.boolean :published, :default => false
      t.string :feature_image, :default => 'https://storage.googleapis.com/inner_wisdom_bucket/image.png'
     
      t.timestamps
    end
  end
end
