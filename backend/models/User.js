const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Vui lòng nhập tên người dùng'],
    unique: true,
    trim: true,
    minlength: [3, 'Tên người dùng phải từ 3 ký tự trở lên'],
    maxlength: [40, 'Tên người dùng không được vượt quá 40 ký tự'],
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    maxlength: [254, 'Email không được vượt quá 254 ký tự'],
    validate: {
      validator: (value) => EMAIL_PATTERN.test(value),
      message: 'Địa chỉ email không hợp lệ'
    }
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: [6, 'Mật khẩu phải từ 6 ký tự trở lên']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
