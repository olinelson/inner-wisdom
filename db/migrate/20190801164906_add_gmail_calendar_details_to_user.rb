class AddGmailCalendarDetailsToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :google_calendar_email, :string
    add_column :users, :google_calendar_refresh_token, :string
  end
end
