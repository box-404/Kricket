require 'faker'
# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
Message.delete_all
Chat.delete_all
User.delete_all

puts 'Creating  fake users...'
alesya = User.create!(nickname: "lisa", email:"alesya@email.com", password: "123456!")
matt = User.create!(nickname: "matty", email:"matt@email.com", password: "123456!")
tan = User.create!(nickname: "tanty", email:"tan@email.com", password: "123456!")
haris = User.create!(nickname: "harisu", email:"haris@email.com", password: "123456!")

5.times do
  user = User.new(
    nickname:    Faker::Internet.username,
    email: Faker::Internet.email,
    password: Faker::Internet.password()
  )
  user.save!
end

puts 'Creating  fake chats...'
users = User.all
5.times do
  chat = Chat.new(
    title:    Faker::JapaneseMedia::StudioGhibli.quote,
    summary: Faker::Quote.matz,
    temperature:  rand(0..2),
    user: users.sample
  )
  chat.save!
end

puts 'Creating  fake messages...'
chats = Chat.all
roles = ["user", "assistant"]
10.times do
  message = Message.new(
    content:    Faker::Quote.matz,
    chat: chats.sample,
    role: roles.sample
  )
  message.save!
end

puts 'Finished!'
