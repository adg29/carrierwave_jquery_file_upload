class Picture < ActiveRecord::Base
  require "digest"	# Required for md5 hashing
  require "httparty"	# Required for posting to moderation service
  include Rails.application.routes.url_helpers

  belongs_to :city
  belongs_to :user, :autosave => true
  attr_accessible :city_id, :title, :description, :file, :user_attributes, :remote_file_url, :video_url
  validates_presence_of :description, :file


  # ActiveRecord hook
	# Need to find another way to call send_for_moderation upon successful upload
  after_create :send_for_moderation   
	before_save :sync_picture_user

  accepts_nested_attributes_for :user

  mount_uploader :file, ImageUploader

  
  def as_json(options={})
    super(:include => :user)
  end

  def as_xml(options={})
    super(:include => :user)
  end
  

  def sync_picture_user
    self.user_id = self.user.id
  end

  # Send information to moderator
  # REQUIRED FIELDS
  # seed 					str The seed is the current timestamp in milliseconds since epoch
  # hash__value				str The hash value is the MD5 hash of the secret key (assigned by LW) concatenated with the seed
  # subject					str The subject of post, caption of images, title of video, etc (we use this for the title)
  # body					str The body of post, description of image or video, etc.  Optional for images and video. (we use this for the description)
  # content__id				str The unique id of this content, generated by us...use our pictures table id
  # author__id				str The username of the author
  # tracking__id			str The id for this specific request.  It is very important that all requests have unique tracking ids.
  # content__time__stamp	lon The timestamp that this content was created
  # systemId				str A constant assigned by LW (value is Intel_UAT)
  # customerId				str A constant assigned by LW (value is Intel)
  # id						lon A positive number.  We recommend using the same timestamp as the seed.
  # status 					int Always send 0 (zero)
  # OPTIONAL FIELDS
  # content__url			str For images or video, the url to the image or video.  For text, the url to view the content in context.
  # locale					str The locale in standard ISO format.  Default is en_US.
  # modserver.url=modserver-v1-11-uat.stage.liveworld.com

  # private (??)
  def send_for_moderation
    # Configuration values
    lw_system_id = KCONF['lw_system_id']
    lw_customer_id = KCONF['lw_customer_id']
    lw_secret_key = KCONF['lw_secret_key']
	  lw_modserver_url = KCONF['lw_modserver_url']
    # Instance values
    lw_seed = (Time.now.to_f * 1000).to_int # To enforce unique on the tracking id
	  lw_id = lw_content_time_stamp = lw_seed
    lw_hash_value = Digest::MD5.hexdigest("#{lw_secret_key}#{lw_seed}")
    lw_subject = description
    lw_body = description
    lw_content_id = id
		media_name = read_attribute(:file)
		if video_url.nil?
		  lw_content_type = "image"
			lw_content_url = KCONF['kbsp_server_url'] + "/uploads/picture/file/city-#{city_id}/#{media_name}"
		else
			lw_content_type = "video"
			lw_content_url = video_url
		end
    lw_author_id = user.name
		lw_tracking_id = "#{id}_#{lw_seed}"
		lw_locale = "en_US" # Need to get locale along with user HARDCODED

    #REAL/LIVE
	xml = "<com.liveworld.moderation.web.struts.rest.ModerationContent><seed>#{lw_seed}</seed><hash__value>#{lw_hash_value}</hash__value><subject><![CDATA[#{lw_subject}]]></subject><body><![CDATA[#{lw_body}]]></body><content__id>#{lw_content_id}</content__id><content__type>#{lw_content_type}</content__type><author__id><![CDATA[#{lw_author_id}]]></author__id><content__url><![CDATA[#{lw_content_url}]]></content__url><locale>#{lw_locale}</locale><system__id>#{lw_system_id}</system__id><tracking__id>#{lw_tracking_id}</tracking__id><content__time__stamp>#{lw_content_time_stamp}</content__time__stamp><customer__id>#{lw_customer_id}</customer__id><moderation__status>0</moderation__status></com.liveworld.moderation.web.struts.rest.ModerationContent>"
    # AUTO APPROVE status to send is 208
	#xml = "<com.liveworld.moderation.web.struts.rest.ModerationContent><seed>#{lw_seed}</seed><hash__value>#{lw_hash_value}</hash__value><subject><![CDATA[#{lw_subject}]]></subject><body><![CDATA[#{lw_body}]]></body><content__id>#{lw_content_id}</content__id><content__type>#{lw_content_type}</content__type><author__id>#{lw_author_id}</author__id><content__url><![CDATA[#{lw_content_url}]]></content__url><locale>#{lw_locale}</locale><system__id>#{lw_system_id}</system__id><tracking__id>#{lw_tracking_id}</tracking__id><content__time__stamp>#{lw_content_time_stamp}</content__time__stamp><customer__id>#{lw_customer_id}</customer__id><moderation__status>208</moderation__status></com.liveworld.moderation.web.struts.rest.ModerationContent>"
	# AUTO REJECT status to send is 224
	logger.info("THIS IS THE REQUEST WE SEND TO REQUEST MODERATION")
	logger.info(xml)

  # Set up values for httparty post
	options = {
	  :headers => {
		"Content-Type" => "application/xml"
	  },
	  :body => xml
	}
	
    rsp = HTTParty.post("http://#{lw_modserver_url}/EndPointClientAxis2/rest/moderation_contents.xml", options)
	logger.info("THIS IS THE RESPONSE FOR THE REQUEST WE SENT TO REQUEST MODERATION")
	logger.info(rsp.parsed_response)
	logger.info(rsp.response.code) # 201
  end
  
  def self.retrieve_moderated_content
    # Configuration values
    lw_system_id = KCONF['lw_system_id']
    lw_customer_id = KCONF['lw_customer_id']
    lw_secret_key = KCONF['lw_secret_key']
	lw_modserver_url = KCONF['lw_modserver_url']
	
	# Class values
    lw_seed = (Time.now.to_f * 1000).to_int
    lw_hash_value = Digest::MD5.hexdigest("#{lw_secret_key}#{lw_seed}")
  
	data = {:query =>  	{ 
						:seed => "#{lw_seed}",
						:hash_value => "#{lw_hash_value}",
						:system_id => "#{lw_system_id}",
						:customer_id => "Intel"
						} 
			}

	rsp = HTTParty.get("http://#{lw_modserver_url}/EndPointClientAxis2/rest/moderation_contents.xml", data)	
	logger.info("THIS IS THE RESPONSE TO OUR GET REQUEST TO RETRIEVE MODERATED CONTENT")
	logger.info(rsp.parsed_response)
	logger.info(rsp.response.code) # 201
	# get the id (content__id) for the picture and update the database with moderation__status
	# Moderation status 0x10 (211) means it was approved, while 0x20 means it was rejected.  
	# If you passed in one of the special moderation statuses, you will get back 0xD0 or 0xE0, whichever you sent.
	# But for testing, you can set it to 208 (0xD0) to automatically approve the content or 224 (0xE0) to auto-reject
	# Also need to build an array of successfully logged tracking ids (id)
	
	rsp.each do | list, mod |
		# If the set of retrieved records is not null
		if !mod.nil?
			# Need to build an array of tracking ids in here
			tids = []
			mod.each do | k, v |
				# When there is only one record retrieved, the record is represented as a single hash.  
				# If more than one record is retrieved, the records are stored in an array
				records = v
				if v.is_a?( Hash )
					records = [ v ] 
				end
				
				records.each do |a|
					media = Picture.find_by_id(a['content__id'])
					if !media.nil?
					  if media.update_attribute('moderation_status', a['moderation__status'])
						  tids.push("#{a['tracking__id']}")
					  end
					end
				end
			end	# end each
			# Post the retrieval confirmation here
			if tids.length > 0
				xml = "<com.liveworld.moderation.web.struts.rest.Confirmation>
						<seed>#{lw_seed}</seed>
						<hash__value>#{lw_hash_value}</hash__value>
						<customer__id>#{lw_customer_id}</customer__id>
						<system__id>#{lw_system_id}</system__id>
						<tracking__id>"
				tidStrs = ""		
				for i in tids
					tidStrs += "<string>#{i}</string>"
				end
				xml += tidStrs
				xml +="</tracking__id></com.liveworld.moderation.web.struts.rest.Confirmation>"	
				# Set up values for httparty post
				options = {
				  :headers => {
					"Content-Type" => "application/xml"
				  },
				  :body => xml
				}
				# Post confirmation to service
				rsp = HTTParty.post("http://#{lw_modserver_url}/EndPointClientAxis2/rest/confirmations.xml", options)	
				logger.info("THIS IS THE XML WE POST BACK TO LIVEWORLD")
				logger.info(xml)
				logger.info("THIS IS THE RESPONSE WE GET FROM LIVEWORLD AFTER POSTING CONFIRMATION")
				logger.info("#{rsp.parsed_response} with STATUS #{rsp.response.code}")
			end			
		end
	end
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
    "medium_url" => file.medium.url,
    "thumbnail_url" => file.thumb.url,
    "rollover_url" => file.rollover.url,
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
