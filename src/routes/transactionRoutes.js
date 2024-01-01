const express = require('express');
const  Transaction  = require('../models/transactionModel');
const Wallet = require('../models/walletModel');
const router = express.Router();

// GET /transactions
router.get('/transactions', async (req, res) => {
    try {
        const { walletId, skip, limit, sortBy = 'date', sortOrder = -1 } = req.query;
        console.log(walletId);

        if (!walletId) {
            return res.status(400).json({ error: 'WalletId is required.' });
        }

        const transactions = await Transaction.find({ walletId })
            .sort({[sortBy]: Number(sortOrder)})
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const formattedTransactions = transactions.map(transaction => ({
            id: transaction._id,
            walletId: transaction.walletId,
            amount: transaction.amount,
            balance: transaction.balance,
            description: transaction.description,
            date: transaction.date,
            type: transaction.type
        }));

        res.status(200).json(formattedTransactions);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//post transactions
router.post('/transact/:walletId', async (req, res) => {
    try {
        const walletId = req.params.walletId;

        const { amount, description } = req.body;
        const parsedAmount = amount

        const wallet = await Wallet.findById(walletId);

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found.' });
        }

        const transactionType = parsedAmount >= 0 ? 'CREDIT' : 'DEBIT';
        
        if(transactionType==='DEBIT' && Math.abs(parsedAmount)>wallet.balance){
            return res.status(404).json({error: "Amount exceed the balance"})
        }

        const newBalance = wallet.balance + parsedAmount;

        const transaction = new Transaction({
            walletId: walletId,
            amount: Math.abs(parsedAmount),
            balance: newBalance,
            description: description,
            type: transactionType,
        });

        const savedTransaction = await transaction.save();

        wallet.balance = newBalance;
        await wallet.save();

        const response = {
            balance: newBalance,
            transactionId: savedTransaction._id,
        };
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

module.exports = router;
