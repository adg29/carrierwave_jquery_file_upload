class AddCityIdToPictures < ActiveRecord::Migration
  def change
    add_column :pictures, :city_id, :integer
  end
end
