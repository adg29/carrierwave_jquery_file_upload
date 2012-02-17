class Picture < ActiveRecord::Base
  belongs_to :city
  belongs_to :user, :autosave => true
  attr_accessible :city_id, :title, :description, :file, :user_attributes, :remote_file_url
  validates_presence_of :title, :description, :file

  accepts_nested_attributes_for :user

  include Rails.application.routes.url_helpers


  mount_uploader :file, ImageUploader

  before_save :sync_picture_user
  
  def as_json(options={})
    super(:include => :user)
  end

  def as_xml(options={})
    super(:include => :user)
  end
  

  def sync_picture_user
    self.user_id = self.user.id
  end

  #one convenient method to pass jq_upload the necessary information
  def to_jq_upload
  {
    "id" => read_attribute(:id),
    "title" => read_attribute(:title),
    "description" => read_attribute(:description),
    "name" => read_attribute(:file),
    "city_id" => read_attribute(:city_id),
    "size" => file.size,
    "url" => file.url,
    "thumbnail_url" => file.thumb.url,
    "delete_url" => picture_path(:id),
    "delete_type" => "DELETE" 
   }
  end

  def autosave_associated_records_for_user
    # Find or create the user by fbid 
    if new_user = User.find_by_fbid(user.fbid) then
      self.user = new_user
    else
      logger.debug('USER NOT FOUND')
      self.user.save!
    end
  end

end
