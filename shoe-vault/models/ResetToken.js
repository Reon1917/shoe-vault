import mongoose from 'mongoose';

const ResetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
  used: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Add index for token lookup and automatic expiration
ResetTokenSchema.index({ token: 1 });
ResetTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.ResetToken || mongoose.model('ResetToken', ResetTokenSchema);
