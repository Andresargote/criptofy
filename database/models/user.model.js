const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            default: 'user'
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        recoveryToken: {
            type: String,
            default: null
        },
        description: {
            type: String,
        },
        profileImg: {
            type: String,
        },
        instagram: {
            type: String,
        },
        twitter: {
            type: String,
        },
        tiktok: {
            type: String,
        },
        telegram: {
            type: String,
        },
        cryptoAddresses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Crypto',
            }
        ]
    },
    { timestamps: true }
);

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.recoveryToken;
    delete user.email; //No estoy muy seguro si es buena idea quitar el email del objeto User.
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;