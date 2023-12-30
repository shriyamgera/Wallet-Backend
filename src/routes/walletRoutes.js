const express = require('express');
const Wallet = require('../models/walletModel');
const Transaction = require('../models/transactionModel');
const router = express.Router();


// setup wallet
router.post('/setup', async function(req, res){
    try{
        const {balance, name} = req.body;

        const newWallet = new Wallet({balance, name});
        const savedWallet = await newWallet.save();
        const newTransaction = new Transaction({
            walletId: savedWallet._id,
            amount: balance,
            balance: balance,
            description: 'Initial Deposit',
            date: new Date(),
            type: 'CREDIT'
        })
        const saveTrans= await newTransaction.save()

        const response ={
            id: savedWallet._id,
            balance: savedWallet.balance,
            transactionId: saveTrans._id,
            name: savedWallet.name,
            date: new Date()
        }

        res.status(200).send(response);
    }catch(e){
        res.status(500).json({error: e.message});
    }
})


//get wallet details
router.get('/wallet/:id', async (req, res) => {
    try {
        const walletId = req.params.id;

        const wallet = await Wallet.findById(walletId);

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found.' });
        }

        const response = {
            id: wallet._id,
            balance: wallet.balance,
            name: wallet.name,
            date: wallet.date,
        };

        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


module.exports =router;