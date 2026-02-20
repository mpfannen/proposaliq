import { Resend } from 'resend';

/**
 * Sends a welcome/onboarding email to a newly registered user.
 * Fire-and-forget — failures are logged but do not block registration.
 */
export async function sendWelcomeEmail(toEmail: string, name: string): Promise<void> {
  const fromAddress = process.env.EMAIL_FROM || 'noreply@getproposaliq.com';
  const apiKey = process.env.RESEND_API_KEY;
  const loginUrl = 'https://getproposaliq.com/login';
  const firstName = name.split(' ')[0] || name;

  if (!apiKey) {
    console.log('\n📧 ========== WELCOME EMAIL (dev mode) ==========');
    console.log(`To: ${toEmail}`);
    console.log(`Name: ${name}`);
    console.log('================================================\n');
    return;
  }

  const resend = new Resend(apiKey);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ProposalIQ</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.08);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:36px 40px;text-align:center;">
              <h1 style="margin:0 0 6px;color:#ffffff;font-size:30px;font-weight:800;letter-spacing:-0.5px;">ProposalIQ</h1>
              <p style="margin:0;color:rgba(255,255,255,0.85);font-size:14px;font-weight:500;">AI-Powered RFP Proposals</p>
            </td>
          </tr>

          <!-- Welcome body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 12px;color:#1a1a2e;font-size:22px;font-weight:700;">Welcome aboard, ${firstName}! 🎉</h2>
              <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.7;">
                Thanks for joining the <strong>ProposalIQ beta</strong>. You now have access to an AI-powered tool that turns
                RFP documents into polished, professional proposals in minutes.
              </p>
              <p style="margin:0 0 28px;color:#555;font-size:15px;line-height:1.7;">
                Here's how to create your first proposal:
              </p>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">

                <!-- Step 1 -->
                <tr>
                  <td style="padding:0 0 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="48" valign="top">
                          <div style="width:36px;height:36px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;text-align:center;line-height:36px;color:#fff;font-weight:800;font-size:15px;">1</div>
                        </td>
                        <td valign="top" style="padding-left:4px;">
                          <p style="margin:0 0 4px;color:#1a1a2e;font-size:15px;font-weight:700;">Upload your company info to the Knowledge Base</p>
                          <p style="margin:0;color:#666;font-size:13px;line-height:1.6;">Add your company overview, case studies, team bios, and pricing docs. ProposalIQ uses these to personalize every proposal it writes.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="padding:0 0 16px;"><div style="height:1px;background:#f0f0f0;"></div></td></tr>

                <!-- Step 2 -->
                <tr>
                  <td style="padding:0 0 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="48" valign="top">
                          <div style="width:36px;height:36px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;text-align:center;line-height:36px;color:#fff;font-weight:800;font-size:15px;">2</div>
                        </td>
                        <td valign="top" style="padding-left:4px;">
                          <p style="margin:0 0 4px;color:#1a1a2e;font-size:15px;font-weight:700;">Upload an RFP document</p>
                          <p style="margin:0;color:#666;font-size:13px;line-height:1.6;">Drop in any RFP as a PDF, DOC, or DOCX file. ProposalIQ will extract and analyse the requirements automatically.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="padding:0 0 16px;"><div style="height:1px;background:#f0f0f0;"></div></td></tr>

                <!-- Step 3 -->
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="48" valign="top">
                          <div style="width:36px;height:36px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;text-align:center;line-height:36px;color:#fff;font-weight:800;font-size:15px;">3</div>
                        </td>
                        <td valign="top" style="padding-left:4px;">
                          <p style="margin:0 0 4px;color:#1a1a2e;font-size:15px;font-weight:700;">Generate your first AI-powered proposal</p>
                          <p style="margin:0;color:#666;font-size:13px;line-height:1.6;">Hit Generate and watch ProposalIQ produce a tailored, professional response in under a minute. Review, copy, or print it directly from the app.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}"
                       style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:15px 40px;border-radius:8px;letter-spacing:0.2px;">
                      Go to ProposalIQ →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Beta note -->
              <div style="background:#f8f7ff;border:1px solid #e0dcff;border-radius:8px;padding:16px 20px;">
                <p style="margin:0 0 6px;color:#667eea;font-size:13px;font-weight:700;">🧪 You're a free beta user</p>
                <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">
                  ProposalIQ is in active development and your account is completely free during the beta.
                  Your feedback genuinely shapes the product — reply to this email anytime with ideas, bugs, or feature requests.
                  We read every message.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:20px 40px;text-align:center;border-top:1px solid #f0f0f0;">
              <p style="margin:0;color:#bbb;font-size:12px;">
                &copy; ${new Date().getFullYear()} ProposalIQ. All rights reserved.<br />
                You're receiving this because you created a ProposalIQ account.
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
    subject: 'Welcome to ProposalIQ — Here\'s how to get started',
    html,
  });

  if (error) {
    console.error('❌ Failed to send welcome email:', error);
    return;
  }

  console.log(`✅ Welcome email sent to ${toEmail}`);
}

/** Sends a password reset request email containing a tokenized reset link. */

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

/** Sends a confirmation email after a password reset has been completed successfully. */
export async function sendPasswordResetSuccessEmail(toEmail: string): Promise<void> {
  const fromAddress = process.env.EMAIL_FROM || 'noreply@getproposaliq.com';
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('\n📧 ========== PASSWORD RESET SUCCESS EMAIL (dev mode) ==========');
    console.log(`To: ${toEmail}`);
    console.log('================================================================\n');
    return;
  }

  const resend = new Resend(apiKey);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset Successful</title>
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
              <div style="text-align:center;margin-bottom:24px;">
                <div style="display:inline-block;background:#e8f5e9;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;">✅</div>
              </div>
              <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:22px;font-weight:700;text-align:center;">Password Reset Successful</h2>
              <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;text-align:center;">
                Your ProposalIQ password has been successfully reset. You can now log in with your new password.
              </p>
              <p style="margin:0 0 28px;color:#777;font-size:13px;line-height:1.6;text-align:center;">
                If you did not make this change, please contact support immediately.
              </p>
              <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 24px;" />
              <p style="margin:0;color:#aaa;font-size:12px;line-height:1.6;text-align:center;">
                This is an automated security notification from ProposalIQ.
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
    subject: 'Your ProposalIQ password has been reset',
    html,
  });

  if (error) {
    // Log but don't throw — a failure here shouldn't block the user
    console.error('❌ Failed to send password reset success email:', error);
    return;
  }

  console.log(`✅ Password reset success email sent to ${toEmail}`);
}
