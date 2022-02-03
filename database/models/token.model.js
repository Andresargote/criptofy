const mongoose = require('mongoose');
const { Schema } = mongoose;

const TokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
        },
        isValid: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        userId: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }
);

const Token = mongoose.model("Token", TokenSchema);
module.exports = Token;