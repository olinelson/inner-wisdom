class AddMedicareNumberToUsers < ActiveRecord::Migration[5.2]
  def change
     add_column :users, :medicare_number, :integer
  end
end
