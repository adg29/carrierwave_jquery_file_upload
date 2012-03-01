class UsersController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  before_filter(:only => [:index, :edit, :destroy]) do |controller|
    authenticate_admin unless controller.request.format.xml?
  end

  def authenticate_admin
    if (current_admin.nil?) 
      redirect_to(root_path) 
    end
  end

  def record_not_found(exception=nil)
    render :xml => { :message => exception.message, :status => 404 }
  end
  # GET /users
  # GET /users.json
  def index
    @users = User.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @users }
      format.xml { render xml: @users }
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    @user = User.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user }
      format.xml { render xml: @user }
    end
  end

  # GET /users/1/fbuser
  # GET /users/1/fbuser.json
  # GET /users/1/fbuser.xml
  def fbuser
    @user = User.find_by_fbid!(params[:id])

      logger.debug('not found')
      logger.debug( @user.inspect )
    if( @user.nil? )	
      logger.debug('error')
    end

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user }
      format.xml { render xml: @user }
    end
  end

  # GET /users/new
  # GET /users/new.json
  def new
    @user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(params[:user])

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render json: @user, status: :created, location: @user }
      else
        format.html { render action: "new" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /users/1
  # PUT /users/1.json
  def update
    @user = User.find(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user = User.find(params[:id])
    @user.destroy

    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :ok }
    end
  end
end
