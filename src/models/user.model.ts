import mongoose from '../config/database';

const userSchema = new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        email: { type: String, lowercase: true, unique: true },
        password: String,
        logs: { last_login: { type: Date }, online: { type: Boolean, default: false } },
        wallet: {
            account: {
                type: Number, unique: true, partialFilterExpression: {
                    "account": { $type: "number" }
                }
            },
            balance: { type: Number, set: function (v: number) { return Math.round(v) }, default: 0 },
            status: { type: String, default: 'active' }
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

const User = mongoose.model('User', userSchema);

export default User;