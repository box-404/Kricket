class Chat < ApplicationRecord
  has_many :messages
  belongs_to :user
  validates :title, presence: true, length: { maximum: 30 }
  validates :temperature, presence: true, numericality: { greater_than_or_equal_to: 0.0,
  less_than_or_equal_to: 2.0
  }
end
