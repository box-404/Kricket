class ChatsController < ApplicationController

  def new

  end

  def create

  end

  def index
    @chats = Chat.all
  end

  def show

  end

  private

  def chat_params
    params.require(:chat).permit(:title, :summary, :temperature)
  end
end
