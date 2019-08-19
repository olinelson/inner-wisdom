class AddVetedToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :vetted, :boolean, :default => false
  end
end
