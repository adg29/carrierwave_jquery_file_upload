class MosaicsController < ApplicationController

  # GET /mosaics/latest
  # GET /mosaics/latest.json
  def latest 
    @mosaic = Mosaic.last
    if @mosaic.nil?
      @mosaic = []
    end

    logger.debug( @mosaic )
    @mosaic_pic_list = Mosaic.latest_pic_list(1)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: ( @mosaic + @mosaic_pic_list ) }
      format.xml { render xml: ( @mosaic + @mosaic_pic_list ) }
    end
  end

  # GET /mosaics
  # GET /mosaics.json
  def index
    @mosaics = Mosaic.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @mosaics }
    end
  end

  # GET /mosaics/1
  # GET /mosaics/1.json
  def show
    @mosaic = Mosaic.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @mosaic }
    end
  end

  # GET /mosaics/new
  # GET /mosaics/new.json
  def new
    @mosaic = Mosaic.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @mosaic }
    end
  end

  # GET /mosaics/1/edit
  def edit
    @mosaic = Mosaic.find(params[:id])
  end

  # POST /mosaics
  # POST /mosaics.json
  def create
    @mosaic = Mosaic.new(params[:mosaic])

    respond_to do |format|
      if @mosaic.save
        format.html { redirect_to @mosaic, notice: 'Mosaic was successfully created.' }
        format.json { render json: @mosaic, status: :created, location: @mosaic }
      else
        format.html { render action: "new" }
        format.json { render json: @mosaic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /mosaics/1
  # PUT /mosaics/1.json
  def update
    @mosaic = Mosaic.find(params[:id])

    respond_to do |format|
      if @mosaic.update_attributes(params[:mosaic])
        format.html { redirect_to @mosaic, notice: 'Mosaic was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @mosaic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /mosaics/1
  # DELETE /mosaics/1.json
  def destroy
    @mosaic = Mosaic.find(params[:id])
    @mosaic.destroy

    respond_to do |format|
      format.html { redirect_to mosaics_url }
      format.json { head :ok }
    end
  end
end
