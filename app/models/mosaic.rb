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

  def self.latest_mosaic_by_city(a_cityid)
    @mosaic = Mosaic.find_last_by_city_id(a_cityid)
    logger.debug( @mosaic.inspect )
    "/mosaics/city-"+a_cityid.to_s+"/"+@mosaic.id.to_s+".jpg"
  end
end

