class MessagesController < ApplicationController

  def create
    @chat = Chat.find(params[:chat_id])
    @message = @chat.messages.new(message_params)
    @message.role = "user"
    if @message.save
      redirect_to chat_path(@chat)
      chat = RubyLLM.chat
      prompt = "Someone just said: '#{@message.content}'. Reply with a single casual, friendly question to keep the conversation going naturally."
      response = chat.ask(prompt)
      @kricket_message = @chat.messages.create(
      content: response.content,
      role: "assistant"
    )
      # Message.new = response.content
      # @message.role = "assistant"
    else
      render "chats/show", status: :unprocessable_entity
    end
  end

  def new
    @message = Message.new
    @chat = Chat.find(params[:chat_id])
  end

  private

  def message_params
    params.require(:message).permit(:content)
  end
end
