import { Resend } from 'resend';

export async function sendPasswordResetEmail(
  toEmail: string,
  resetToken: string
): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;
  const fromAddress = process.env.EMAIL_FROM || 'noreply@getproposaliq.com';
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev fallback — print to console so you can click the link without a mail server
    console.log('\n📧 ========== PASSWORD RESET EMAIL (dev mode) ==========');
    console.log(`To:      ${toEmail}`);
    console.log(`Link:    ${resetLink}`);
    console.log('=======================================================\n');
    return;
  }

  const resend = new Resend(apiKey);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.08);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">ProposalIQ</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:22px;font-weight:700;">Reset Your Password</h2>
              <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                We received a request to reset the password for your ProposalIQ account.
                Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
              </p>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${resetLink}"
                       style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 36px;border-radius:8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;color:#777;font-size:13px;line-height:1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 28px;word-break:break-all;">
                <a href="${resetLink}" style="color:#667eea;font-size:13px;">${resetLink}</a>
              </p>

              <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 24px;" />

              <p style="margin:0;color:#aaa;font-size:12px;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email —
                your password will not be changed. This link expires in 1 hour.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:20px 40px;text-align:center;border-top:1px solid #f0f0f0;">
              <p style="margin:0;color:#bbb;font-size:12px;">
                &copy; ${new Date().getFullYear()} ProposalIQ. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const { error } = await resend.emails.send({
    from: `ProposalIQ <${fromAddress}>`,
    to: toEmail,
    subject: 'Reset your ProposalIQ password',
    html,
  });

  if (error) {
    console.error('❌ Resend error:', error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }

  console.log(`✅ Password reset email sent to ${toEmail}`);
}
