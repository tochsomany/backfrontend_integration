require("dotenv").config();
const mongoose =require('mongoose')
const dbName = "cadt-db"
const uri = `mongodb://${process.env.MONGO_HOST}:27017/${dbName}`

async function dbConnect (){
    mongoose.connection.on('connected', () => {
        console.log("Connected")
    })
    await mongoose.connect(uri)
}

module.exports = dbConnect