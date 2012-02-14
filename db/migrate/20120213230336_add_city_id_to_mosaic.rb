class AddCityIdToMosaic < ActiveRecord::Migration
  def change
    add_column :mosaics, :city_id, :integer
  end
end
