# Supabase Email Templates Configuration

This document provides the email templates you need to configure in your Supabase dashboard for OTP verification.

## How to Configure Email Templates in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `wtjishglgehdryovvzib`
3. Navigate to **Authentication** → **Email Templates**
4. Copy and paste the templates below into the respective sections

## 1. Confirm Signup Template

**Template Type:** `Confirm signup`

**Subject:** `Verify your email for {{ .SiteName }}`

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .code { background: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b; margin: 30px 0; border-radius: 8px; }
        .button { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 30px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">{{ .SiteName }}</div>
            <h1>Verify your email address</h1>
        </div>
        <div class="content">
            <p>Hi there,</p>
            <p>Thank you for signing up for {{ .SiteName }}! To complete your registration and start shopping, please verify your email address.</p>
            
            <p>Your verification code is:</p>
            <div class="code">{{ .Token }}</div>
            
            <p>Or click the link below to verify your email:</p>
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Verify Email</a>
            </div>
            
            <p><strong>This code will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with us, you can safely ignore this email.</p>
            
            <div class="footer">
                <p>Happy shopping!<br>The {{ .SiteName }} Team</p>
            </div>
        </div>
    </div>
</body>
</html>
```

## 2. Reset Password Template

**Template Type:** `Reset password`

**Subject:** `Reset your password for {{ .SiteName }}`

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset your password</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 30px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; color: #991b1b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">{{ .SiteName }}</div>
            <h1>Reset your password</h1>
        </div>
        <div class="content">
            <p>Hi there,</p>
            <p>We received a request to reset your password for your {{ .SiteName }} account.</p>
            
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
                <strong>Security Notice:</strong> This link will expire in 24 hours. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f8fafc; padding: 10px; border-radius: 4px; font-size: 12px;">{{ .ConfirmationURL }}</p>
            
            <div class="footer">
                <p>Stay safe,<br>The {{ .SiteName }} Team</p>
            </div>
        </div>
    </div>
</body>
</html>
```

## Additional Supabase Configuration

### 1. Site Settings
In your Supabase dashboard, go to **Settings** → **General** and set:
- **Site Name**: `Agile Shop` (or your preferred site name)
- **Site URL**: Your production URL (e.g., `https://your-domain.com`)

### 2. Authentication Settings
Go to **Authentication** → **Settings** and ensure:
- **Enable email confirmations**: ✅ Enabled
- **Enable email confirmations for new signups**: ✅ Enabled
- **Enable email confirmations for password changes**: ✅ Enabled
- **Enable email confirmations for email changes**: ✅ Enabled

### 3. Email Provider
Make sure you have configured an email provider in **Authentication** → **Settings** → **Email Provider**:
- Choose between Supabase's built-in email service or configure your own SMTP
- If using SMTP, provide your server details and credentials

## Database Schema

Your current schema already includes the necessary `users` table. The OTP functionality is handled by Supabase's built-in authentication system, so no additional database tables are needed for OTP tracking.

## Testing the Flow

1. Go to `/website/signup` and create a new account
2. You should receive an email with a 6-digit code
3. You'll be redirected to `/website/verify-otp`
4. Enter the code to verify your email
5. After verification, you'll be logged in and redirected to the shop

The templates above provide a professional, branded experience for your e-commerce store with proper security messaging and clear calls-to-action.
