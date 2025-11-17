class Message < ApplicationRecord
  belongs_to :chat
  validates :content, presence: true
  validates :role, presence: true
end
