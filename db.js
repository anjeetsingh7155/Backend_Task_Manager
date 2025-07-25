const mongoose = require('mongoose')

// Get the Schema constructor from mongoose
const Schema = mongoose.Schema; 
// Get the ObjectId type from mongoose Schema Types
const objectID  = Schema.Types.ObjectId; 

// Defining the user Schema for MongoDB
const user = new Schema({
    Name : String, // User's name
    email: {type: String, unique: true}, // User's email, must be unique
    password : String // User's password
})

// Defining the todo Schema for MongoDB
const todo = new Schema({
    userId : objectID, // Reference to the user's ObjectId
    title : String,    // Title of the todo item
    done : Boolean     // Status if the todo is completed
})

// Creating the User model from the user Schema
const UserModel = mongoose.model('user',user)
// Creating the Todo model from the todo Schema
const TodoModel = mongoose.model('todos',todo)

// Exporting the models for use in other files
module.exports = {
    UserModel : UserModel,
    TodoModel :TodoModel
}