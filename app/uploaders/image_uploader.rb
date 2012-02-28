class ImageUploader < CarrierWave::Uploader::Base

  # Include RMagick or ImageScience support:
    include CarrierWave::RMagick
  # include CarrierWave::ImageScience
  # include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
   storage :file
  #storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/city-#{model.city_id}"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:

  def quantize
    manipulate! do |img|
      img = img.quantize(256, Magick::GRAYColorspace)
    end
  end

  process :resize_to_fit => [700, 420]

  version :thumb do
    process :resize_to_fit => [135, 135]
    process :quantize
  end

  version :rollover do
    process :resize_to_fit => [135, 135]
  end
  
  version :medium do
    process :resize_to_fit => [350, 195]
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(jpg jpeg gif png JPEG JPG png)
  end

  # Override the filename of the uploaded files:
  # def filename
  #   "something.jpg" if original_filename
  # end
  def filename 
    if original_filename 
      @name ||= Digest::MD5.hexdigest(File.dirname(current_path))
      "#{@name}.#{file.extension}"
    end
  end
  

end
