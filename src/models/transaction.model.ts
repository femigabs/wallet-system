import mongoose from '../config/database';

const transactionType = ['deposit', 'transfer'];
const status = ['success', 'pending', 'failed']

const transactionSchema = new mongoose.Schema(
    {
        user_account: { type: Number, required: true },
        receiver_account: { type: Number },
        amount: { type: Number, required: true, set: function (v: number) { return Math.round(v) }, default: 0 },
        transaction_id: { type: String, required: true }, // internal transaction id
        payment_id: { type: String }, // Id from external payment references
        transaction_type: {
            type: String,
            enum: transactionType,
            required: true,
        },
        status: {
            type: String,
            enum: status,
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
    }
)

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;