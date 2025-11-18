class ChatsController < ApplicationController

  def new

  end

  def create

  end

  def index

  end

  def show
  @chat = Chat.find(params[:id])
  @message = Message.new
  end

  private

  def chat_params
    params.require(:chat).permit(:title, :summary, :temperature)
  end
end
