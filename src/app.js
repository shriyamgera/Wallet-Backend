const express= require('express');
const walletRoutes = require('./routes/walletRoutes.js')
const transactionRoutes = require('./routes/transactionRoutes.js')
const Wallet = require('./models/walletModel.js');
const Transaction = require('./models/transactionModel.js')
const connectDB = require('./database.js')
const app = express();


connectDB()
app.use(express.json());
app.use('/', walletRoutes)
app.use('/', transactionRoutes)




const PORT = process.env.PORT || 9000;
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));
