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
  
  # GET /cities/:city_id/mosaics/generate
  # GET /cities/:city_id/mosaics/generate.json
  def self.generate_city(city_to_generate = 'Seoul')
    logger.info('GENERATE CITY IN MOSAIC MODEL FIRED')
    #@city = City.find_by_name(params['city_id'])
    if city_to_generate.nil?
      @city = City.find_last_by_status('open')
    else
      @city = City.find_by_name(city_to_generate)
    end
    
    Resque.enqueue( MosaicGenerator, @city.id )
    logger.debug( @city.inspect )
    #respond_to do |format|
      #format.html #generate.html
      #format.json { render json: ( @city ) }
    #end
  end

end

