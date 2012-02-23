class CitiesController < ApplicationController

  # GET /cities/1
  # GET /cities/1.json
  def interactive 
      logger.debug('PARAMS')
      logger.debug( params.inspect )
    if params[:id].nil? || params[:id]=="interactive"
      logger.debug('INTERACT')
      @city_none = true;
      @city = City.find_last_by_status('generated')
      logger.debug( @city.inspect )
    else
      logger.debug('dont INTERACT')
      @city = City.find_by_id(params[:id])
    end

    @mosaic = Mosaic.find_last_by_city_id(@city.id)
    if @mosaic.nil?
      @mosaic = Mosaic.find(:last)
    end

    respond_to do |format|
      format.html # show.html.erb
    end
  end

  # GET /cities/latest
  # GET /cities/latest.json
  def latest 
    @city = City.find_by_status('open')
    @picture = Picture.new
    @picture.build_user

    respond_to do |format|
      format.html { render "pictures/new" }
    end
  end

  # GET /cities/1/mosaic.json
  def mosaic 
    @city = City.find_by_id(params[:id])

    @mosaic_url = Mosaic.latest_mosaic_by_city(@city.id)

    respond_to do |format|
      format.json { render json: @mosaic_url }
    end
  end

  # GET /cities
  # GET /cities.json
  def index
    @cities = City.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @cities }
      format.xml{ render xml: @cities }
    end
  end

  # GET /cities/1
  # GET /cities/1.json
  def show
    # id actually contains the city name
    @city = City.find_by_id!(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @city }
    end
  end

  # GET /cities/new
  # GET /cities/new.json
  def new
    @city = City.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @city }
    end
  end

  # GET /cities/1/edit
  def edit
    @city = City.find(params[:id])
  end

  # POST /cities
  # POST /cities.json
  def create
    @city = City.new(params[:city])

    respond_to do |format|
      if @city.save
        format.html { redirect_to city_url(@city.id), notice: 'City was successfully created.' }
        format.json { render json: @city, status: :created, location: @city }
      else
        format.html { render action: "new" }
        format.json { render json: @city.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /cities/1
  # PUT /cities/1.json
  def update
    @city = City.find(params[:id])

    respond_to do |format|
      if @city.update_attributes(params[:city])
        format.html { redirect_to @city, notice: 'City was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @city.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cities/1
  # DELETE /cities/1.json
  def destroy
    @city = City.find(params[:id])
    @city.destroy

    respond_to do |format|
      format.html { redirect_to cities_url }
      format.json { head :ok }
    end
  end
end
