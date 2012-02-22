class AddVideoUrlToPictures < ActiveRecord::Migration
  def change
    add_column :pictures, :video_url, :string
  end
end
