require 'RMagick'
include Magick
 
class Mosaic < ActiveRecord::Base
  belongs_to :city
  has_many :pictures

  def self.latest_pic_list(a_cityid)
    @pictures = Picture.find_all_by_city_id(a_cityid)
    @pictures
    # create a string from the ids of all pictures in list 
  end
end

