RMAGICK_ENABLE_MANAGED_MEMORY = true
require 'RMagick'
include Magick
 
class MosaicGenerator
  @queue = :mosaic_queue

  @@image_width  = @image_height = 62 
  @@columns      = 124 
  @@padding      = 0 
  @@full_rows_only = false 
  
  def self.perform(city_id)
    @input_dir  = "public/uploads/picture/file/city-#{city_id}/*"
    tmp_dir = "public/tmp/mc-tmp"
     #FileUtils.mkdir_p(tmp_dir)
     
     # Make all images the same size and put a border on them
     MosaicGenerator.rectify_images(@input_dir, tmp_dir) do |img|
       img = img.crop_resized(@@image_width, @image_height)
     end
     
     Rails.logger.debug( city_id )
     source_images = ImageList.new(*Dir.glob("public/tmp/mc-tmp/thumb_*"))
     pictures_approved = Picture.find_all_by_city_id_and_moderation_status(city_id,19,:select=>'city_id, file, moderation_status')

     Rails.logger.debug( "APPROVED in #{city_id}" )
     Rails.logger.debug( pictures_approved ) 
     files_approved = pictures_approved.map{ |a| a.file }

     sources_deleted = 0
     source_images.to_a.each_with_index do|img,i|
       Rails.logger.debug( i )
       Rails.logger.debug( img )
       filename = img.filename.split('_')

       Rails.logger.debug( "#{filename[1]} in approved?" )
       Rails.logger.info( 'Approved array' )
       Rails.logger.info( files_approved )
       if !(files_approved.include? filename[1]) 	
	Rails.logger.debug( "delete at #{i}" )
        source_images.delete_at(i-sources_deleted)
        sources_deleted += 1
	Rails.logger.debug( source_images.length )
       end
     end

     source_images_o = source_images.copy

     Rails.logger.debug( 'SOURCE IMAGES' )
     Rails.logger.debug( source_images.inspect )
     
     #add the cue tile image to the source images

     source_length = source_images.length
     #figure out how many images needed to complete the row with @@columns
     source_columns_overflow = source_length % @@columns 
     source_columns_needed = @@columns - source_columns_overflow

     Rails.logger.debug( "need #{source_columns_needed} cause have only #{source_columns_overflow}" )

     1.upto(source_columns_needed) do
       Rails.logger.debug( source_images.to_a.sample )
       if !source_images.to_a.sample.nil?
         source_images.push( (source_images.to_a.sample).copy )  
       end
     end

     Rails.logger.debug( "now you have #{source_images.length}" )

     #figure out how many copies of source_images we need to make a factor of 10,584
     source_length = source_images.length
     source_copy_count = (441/source_length).floor
     Rails.logger.debug( "to make a factor of 10584 you need #{source_copy_count-1} of your #{source_length}" )
     1.upto((source_copy_count-1)*source_length) do
       if !source_images_o.to_a.sample.nil?
         source_images.push( (source_images_o.to_a.sample).copy )        
	 #Rails.logger.debug( source_images.length )
       end
     end
    
    source_ids = []
    source_images.each_with_index do |image,index| 
      filename = image.filename.split('/')[-1]
      @picture_source = Picture.find_by_file(filename.split('_')[1])
      Rails.logger.debug(@picture_source.inspect)
      fileid = @picture_source.id
      source_ids.push( fileid )
    end

    Rails.logger.debug('ALL THESE')
    Rails.logger.debug(source_ids.inspect)
     
     #use if source_images have not been resized and simply reside in the input dir
     #source_images = ImageList.new(*Dir.glob(File.expand_path(@input_dir) + "/*"))
    Rails.logger.debug('tiled imags do')

    mosaic = 
      MosaicGenerator.tile_images(source_images, 
                                 @@columns,
                                 @@padding, 
                                 @@full_rows_only)
    
    #`rm -rf #{tmp_dir}` # cleanup tmp dir

    Rails.logger.debug('tiled imags done')

    @mosaic_instance = Mosaic.new( 
      :unit_list => source_ids.join(',') , 
      :unit_count => source_ids.length, 
      :columns => @@columns,
      :rows => source_ids.length/@@columns,
      :city_id => city_id
    )
    mosaic_full = ImageList.new
    1.upto(10584/source_images.length) do
      mosaic_full.push( mosaic.copy )
      @mosaic_instance.unit_list +=  ',' + source_ids.join(',')
      @mosaic_instance.unit_count +=  source_ids.length
      @mosaic_instance.rows +=  source_ids.length/@@columns
    end
    Rails.logger.debug( 'ALL FULL' )
    Rails.logger.debug( mosaic_full.inspect )
     

    row_chunk = 0
    mosaic_full.each_slice(1) do |mosaic_row|
    mosaic_row.each_with_index do |image, row_num|
      y_offset = 62*3 * row_chunk
      Rails.logger.debug( 'row_chunk and rectangle' )
      Rails.logger.debug( row_chunk )
      image.page = Rectangle.new(image.columns,image.rows,0,y_offset)
      row_chunk = row_chunk + 1
    end
    end

    #source_images.mosaic.write('public/mosaic.jpg')
    @mosaic_instance.save

    FileUtils.mkdir_p("public/mosaics/city-#{city_id}")
    
    Rails.logger.debug('WRITE MOSAIC')
    mosaic_full.mosaic.write("public/mosaics/city-#{city_id}/#{@mosaic_instance.id}.jpg")


    # convert
    Rails.logger.debug('DEEPZOOOOOM')
    MosaicsController.tile("public/mosaics/city-#{city_id}/#{@mosaic_instance.id}.jpg","public/mosaics/city-#{city_id}/#{@mosaic_instance.id}.dzi" )

    #logger.debug( source_images.mosaic.inspect )
  end
  
  # assumes images have equal widths and heights
  def self.tile_images(imagelist, columns, padding=0, full_rows_only=false)
    row_num = 0
    puts "each row"
    imagelist.each_slice(columns) do |image_row|
      puts image_row
      break if image_row.size < columns && full_rows_only
      image_row.each_with_index do |image, col_num|
        x_offset = image.columns * col_num
        y_offset = image.rows  * row_num
        
        image.page = Rectangle.new(image.columns,image.rows,x_offset,y_offset)
      end
      row_num += 1
    end
    
    return imagelist.mosaic
  end
  
  # Turns images all into the same size and width and puts them
  # in a temporary directory
  # TODO: Fix this so that it maintains the order.
  #      Right now, image 100.png comes after 1.png, rather than after 99.png
  def self.rectify_images(input_dir, output_dir, &block)
    Rails.logger.debug('HEY')
    Rails.logger.debug( Dir.glob( 'public/uploads/picture/file/city-1/thumb_*' ) )
    imgs = ImageList.new( *Dir.glob( input_dir ) )
    Rails.logger.debug( 'RECTIFY modified' )
    Rails.logger.debug( input_dir )
    Rails.logger.debug( imgs.inspect )
    #FileUtils.mkdir_p(output_dir)
    
    imgs.each_with_index do |img, idx|
      img = yield img
      img.write(output_dir + "/#{ img.filename.split('/')[-1] }")
    end
    Rails.logger.debug('AFTER YILED')
  end
end
