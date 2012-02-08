class AddModerationStatusToPictures < ActiveRecord::Migration
  def change
    add_column :pictures, :moderation_status, :integer
  end
end
