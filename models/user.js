import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_WORK_FACTOR = 10;

let userSchema = new mongoose.Schema({
  username:{type: String, required: true},
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

userSchema.statics.findByLogin = async function (login) {
    let user = await this.findOne({
      username: login,
    });
    if (!user) {
      user = await this.findOne({ email: login });
    }
    return user;
};

userSchema.pre('remove', function(next) {
    this.model('Message').deleteMany({ user: this._id }, next);
});


const User = mongoose.model('User', userSchema);
export default User;