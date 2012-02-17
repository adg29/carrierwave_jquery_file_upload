class UpdateUnitListLimitOnMosaics < ActiveRecord::Migration
  def up
    change_column :mosaics, :unit_list, :text, :limit => 25000 
  end
end
