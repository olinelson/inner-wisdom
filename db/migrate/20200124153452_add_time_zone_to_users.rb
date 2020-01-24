class AddTimeZoneToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :time_zone, :string, default: 'Australia/Sydney'
  end
end
