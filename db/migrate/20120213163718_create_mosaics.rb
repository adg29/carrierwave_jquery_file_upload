class CreateMosaics < ActiveRecord::Migration
  def change
    create_table :mosaics do |t|
      t.integer :rows
      t.integer :columns
      t.integer :unit_count
      t.string :unit_list

      t.timestamps
    end
  end
end
