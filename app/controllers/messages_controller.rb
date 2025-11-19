class MessagesController < ApplicationController

  def create
    @chat = Chat.find(params[:chat_id])
    if params[:audio].present?
      transcribed_text = transcribe_audio(params[:audio])
      @message = @chat.messages.create(
        content: transcribed_text,
        role: "user"
      )
      # temperature = chat.temperature #initialized the temp, need to pass it to the llm
      chat = RubyLLM.chat.with_temperature(@chat.temperature)
      prompt = "Someone just said: '#{@message.content}'. Reply with a single casual, friendly question to keep the conversation going naturally."
      response = chat.ask(prompt)
      @kricket_message = Message.new(
        content: response.content,
        role: "assistant"
      )
      @kricket_message.chat = @chat

      if @kricket_message.save
        respond_to do |format|
          format.html { redirect_to chat_path(@chat) }
          format.turbo_stream
        end
      else
        redirect_to chat_path(@chat)
      end
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

  def transcribe_audio(audio_file)
    client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])

    response = client.audio.transcribe(
      parameters: {
        model: "whisper-1",
        file: audio_file
      }
    )

    response["text"]
  end

end
