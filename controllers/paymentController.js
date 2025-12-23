const User = require('../models/User');
const Transaction = require('../models/Transaction');

const deposit = async (req, res) => {
    const { amount } = req.body;

    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const transaction = await Transaction.create({
        user: req.user._id,
        type: 'DEPOSIT',
        amount,
        status: 'Completed', 
        description: 'Mock Stripe Deposit'
    });

    const user = await User.findById(req.user._id);
    user.walletBalance += Number(amount);
    await user.save();

    res.json({ message: 'Deposit successful', balance: user.walletBalance, transaction });
};

const withdraw = async (req, res) => {
    const { amount } = req.body;
    const user = await User.findById(req.user._id);

    if (amount > user.walletBalance) {
        return res.status(400).json({ message: 'Insufficient funds' });
    }

    const transaction = await Transaction.create({
        user: req.user._id,
        type: 'WITHDRAWAL',
        amount,
        status: 'Completed',
        description: 'Withdrawal to Bank'
    });

    user.walletBalance -= Number(amount);
    await user.save();

    res.json({ message: 'Withdrawal successful', balance: user.walletBalance, transaction });
};

const transfer = async (req, res) => {
    const { amount, recipientEmail } = req.body;
    const sender = await User.findById(req.user._id);
    const recipient = await User.findOne({ email: recipientEmail });

    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });
    if (amount > sender.walletBalance) return res.status(400).json({ message: 'Insufficient funds' });

    sender.walletBalance -= Number(amount);
    recipient.walletBalance += Number(amount);

    await sender.save();
    await recipient.save();

    await Transaction.create({
        user: sender._id,
        type: 'TRANSFER',
        amount: -amount,
        status: 'Completed',
        relatedUser: recipient._id,
        description: `Transfer to ${recipient.name}`
    });

    await Transaction.create({
        user: recipient._id,
        type: 'TRANSFER',
        amount: amount,
        status: 'Completed',
        relatedUser: sender._id,
        description: `Transfer from ${sender.name}`
    });

    res.json({ message: 'Transfer successful' });
};

const getHistory = async (req, res) => {
    const history = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
};

module.exports = { deposit, withdraw, transfer, getHistory };