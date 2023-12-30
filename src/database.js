const mongoose= require('mongoose');

const connectDB = async ()=>{
    try{
        await mongoose.connect('mongodb+srv://priyamgera:ykcVzr3KRdag7sXl@cluster0.4z9spjl.mongodb.net/Wallet');
          console.log('Connected to DB');
    }catch(e){
        console.error('Connection to MongoDB failed:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;