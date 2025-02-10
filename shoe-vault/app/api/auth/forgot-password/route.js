import { randomBytes } from 'crypto';
import { promisify } from 'util';
import User from '@/models/User';
import ResetToken from '@/models/ResetToken';
import { sendEmail } from '@/lib/email';

const randomBytesAsync = promisify(randomBytes);

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Find user
    const user = await User.findOne({ email });
    
    // Generate token even if user not found (prevents email enumeration)
    const token = (await randomBytesAsync(32)).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    if (user) {
      // Save reset token
      await ResetToken.create({
        userId: user._id,
        token,
        expires,
      });

      // Send email
      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`;
      await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        text: `Click the following link to reset your password: ${resetUrl}`,
        html: `
          <p>You requested a password reset for your Shoe Vault account.</p>
          <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        `,
      });
    }

    // Always return success (prevents email enumeration)
    return Response.json({
      message: 'If an account exists with this email, you will receive a password reset link.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return Response.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
