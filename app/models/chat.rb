class Chat < ApplicationRecord
  has_many :messages, dependent: :destroy
  belongs_to :user
  validates :temperature, presence: true, numericality: { greater_than_or_equal_to: 0.0,
  less_than_or_equal_to: 2.0
  }
end
