class PicturesController < ApplicationController

  # GET /pictures
  # GET /pictures.json
  def index
    @pictures = Picture.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @pictures.collect { |p| p.to_jq_upload }.to_json }
      format.xml { render :xml => @pictures.collect { |p| p.to_jq_upload }.to_xml }
    end
  end

  # GET /pictures/1
  # GET /pictures/1.json
  def show
    @picture = Picture.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @picture }
    end
  end

  # GET /pictures/new
  # GET /pictures/new.json
  def new
    if params[:video]=="accept"
      @uploadtype = "a video" 
    else
      @uploadtype = "an image" 
    end 

    @city = City.find_by_name(params[:city_id])
    @picture = Picture.new
    @picture.build_user

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @picture }
    end
  end

  # GET /pictures/1/edit
  def edit
    @picture = Picture.find(params[:id])
  end

  # POST /pictures
  # POST /pictures.json
  def create
    @picture = Picture.new(params[:picture])
    logger.debug('PICTURE SAVE')
    logger.debug(@picture.file.inspect)
    respond_to do |format|
      if @picture.save
       logger.debug( @picture.to_jq_upload )
       logger.debug( 'PICTURE SAVED' )
       format.json { render :json => [ @picture.to_jq_upload ].to_json }
      else
      	logger.debug( @picture.to_json )
	logger.debug( [ @picture.to_jq_upload.merge({ :error => @picture.errors.to_json }) ].to_json )
       logger.debug( 'PICTURE NOT SAVED' )
        format.json { render :json => [ @picture.to_jq_upload.merge({ :error => @picture.errors.to_json }) ].to_json }
      end
    end
  end

  # PUT /pictures/1
  # PUT /pictures/1.json
  def update
    @picture = Picture.find(params[:id])

    respond_to do |format|
      if @picture.update_attributes(params[:picture])
        format.html { redirect_to @picture, notice: 'Picture was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @picture.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /pictures/1
  # DELETE /pictures/1.json
  def destroy
    @picture = Picture.find(params[:id])
    @picture.destroy

    respond_to do |format|
      format.html { redirect_to pictures_url }
      format.json { render :json => true }
    end
  end
end
