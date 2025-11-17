class CreateChats < ActiveRecord::Migration[7.1]
  def change
    create_table :chats do |t|
      t.string :title
      t.text :summary
      t.float :temperature, default: 0
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
