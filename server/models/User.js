const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required'],
    },
    resetOtp: {
        type: String,
        default: null,
    },
    resetOtpExpires: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('passwordHash')) return;
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.passwordHash;
    return user;
};

module.exports = mongoose.model('User', userSchema);
