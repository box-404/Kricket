class ChatsController < ApplicationController

  def new
    @chat = Chat.new
  end

  def create

  end

  def index
    @chats = Chat.all
  end

  def update
    @chat = Chat.find(params[:id])
    @chat.update(temperature: params[:chat][:temperature])
  end

  def show
    @chat = Chat.find(params[:id])
    @message = Message.new
    @last_assistant_msg = @chat.messages.where(role: "assistant").order(created_at: :asc).last
  end

  private

  def chat_params
    params.require(:chat).permit(:title, :summary, :temperature)
  end
end
