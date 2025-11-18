class ChatsController < ApplicationController

  def new
    @chat = Chat.new
  end

  def create

  end

  def index
    @chats = Chat.all
    # @summary = Me
  end

  def show

  end

  private

  def chat_params
    params.require(:chat).permit(:title, :summary, :temperature)
  end
end
