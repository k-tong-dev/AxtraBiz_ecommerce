# OTP Verification Setup Guide

This guide walks you through setting up OTP (One-Time Password) verification for email signup in your e-commerce application.

## Overview

The OTP verification system includes:
- Email signup with OTP verification
- Professional email templates
- Secure OTP verification page
- Resend OTP functionality
- Proper database security policies

## Step 1: Configure Supabase Authentication

### 1.1 Enable Email Confirmations
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `wtjishglgehdryovvzib`
3. Navigate to **Authentication** → **Settings**
4. Ensure these settings are enabled:
   - ✅ **Enable email confirmations**
   - ✅ **Enable email confirmations for new signups**
   - ✅ **Enable email confirmations for password changes**
   - ✅ **Enable email confirmations for email changes**

### 1.2 Configure Email Provider
In the same **Authentication** → **Settings** page:
- **Email Provider**: Choose either:
  - **Supabase Email Service** (recommended for development)
  - **Custom SMTP** (for production)

If using Custom SMTP, configure:
- **SMTP Host**: Your SMTP server
- **SMTP Port**: Usually 587 (TLS) or 465 (SSL)
- **SMTP User**: Your SMTP username
- **SMTP Password**: Your SMTP password
- **SMTP Sender**: Your "from" email address

### 1.3 Set Site Information
Go to **Settings** → **General**:
- **Site Name**: `Agile Shop`
- **Site URL**: Your production URL (e.g., `https://your-domain.com`)
- **Site Description**: Your store description

## Step 2: Configure Email Templates

Copy the email templates from `docs/supabase-email-templates.md` and paste them into:
**Authentication** → **Email Templates**

Configure these template types:
1. **Confirm signup** - For new user registration
2. **Reset password** - For password reset requests
3. **Magic Link** - For passwordless login
4. **Invite user** - For user invitations
5. **Change Email Address** - For email change confirmations

## Step 3: Update Database Schema

Run the updated schema to ensure proper RLS policies:

```sql
-- This is already included in your supabase/schema.sql file
-- Just run it in the Supabase SQL Editor
```

The schema includes:
- Row Level Security (RLS) for the users table
- Proper policies for user data access
- Service role permissions for server operations

## Step 4: Environment Configuration

Ensure your `.env` file has the correct Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wtjishglgehdryovvzib.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 5: Test the Complete Flow

### 5.1 Start Your Application
```bash
npm run dev
```

### 5.2 Test Signup Flow
1. Navigate to `/website/signup`
2. Fill in the signup form:
   - Name: Test User
   - Email: your-test-email@example.com
   - Password: YourSecurePassword123
3. Click "Create account"
4. You should see: "Account created! Check your email for verification code"
5. Check your email for the 6-digit verification code
6. You'll be redirected to `/website/verify-otp`

### 5.3 Test OTP Verification
1. Enter the 6-digit code from your email
2. Click "Verify email"
3. You should see: "Email verified successfully"
4. You'll be redirected to the shop page

### 5.4 Test Resend OTP
1. If you don't receive the email, click "Resend code"
2. Wait for the 60-second countdown
3. Check your email for the new code

## Step 6: Production Considerations

### 6.1 Email Provider
For production, use a reliable email service:
- **Recommended**: SendGrid, Mailgun, or AWS SES
- **Configure SMTP** in Supabase Authentication settings
- **Set up proper SPF/DKIM records** for your domain

### 6.2 Security
- ✅ RLS policies are configured
- ✅ OTP codes expire after 24 hours
- ✅ Rate limiting is handled by Supabase
- ✅ Secure token verification

### 6.3 User Experience
- Clear error messages
- Resend functionality with cooldown
- Mobile-responsive OTP input
- Proper loading states

## Troubleshooting

### Common Issues

1. **Email not received**
   - Check spam/junk folder
   - Verify SMTP configuration
   - Check Supabase logs for email delivery errors

2. **OTP verification fails**
   - Ensure you're entering the exact 6-digit code
   - Check if the code has expired (24 hours)
   - Verify the email address matches

3. **Database errors**
   - Run the schema updates in Supabase SQL Editor
   - Check RLS policies are properly configured

4. **Redirect issues**
   - Ensure `NEXT_PUBLIC_SITE_URL` is set correctly
   - Check callback URL configuration in Supabase

### Debug Mode

Add debug logging to your API routes:

```typescript
// In app/api/auth/verify-otp/route.ts
console.log('Verification attempt:', { email, tokenLength: token?.length })
```

## Files Created/Modified

### New Files
- `app/website/verify-otp/page.tsx` - OTP verification page
- `app/api/auth/verify-otp/route.ts` - OTP verification API
- `app/api/auth/resend-otp/route.ts` - Resend OTP API
- `docs/supabase-email-templates.md` - Email templates
- `docs/otp-setup-guide.md` - This setup guide

### Modified Files
- `hooks/use-auth.ts` - Updated signup function
- `app/website/signup/page.tsx` - Updated signup flow
- `supabase/schema.sql` - Added RLS policies

## Next Steps

1. Configure your Supabase email templates
2. Test the complete signup flow
3. Set up production email provider
4. Monitor email delivery rates
5. Consider adding SMS OTP as an alternative

The OTP system is now fully integrated and ready for use!
