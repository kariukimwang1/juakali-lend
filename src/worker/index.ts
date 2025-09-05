import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  getCurrentUser,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { zValidator } from "@hono/zod-validator";
import { 
  UserRegistrationSchema,
  OTPSchema,
  ApiResponse,
  AdminAccessLog
} from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use("*", cors({
  origin: ["http://localhost:5173", "https://*.workers.dev"],
  credentials: true,
}));

// OAuth endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  try {
    const redirectUrl = await getOAuthRedirectUrl('google', {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    return c.json({ redirectUrl }, 200);
  } catch (error) {
    console.error('OAuth redirect URL error:', error);
    return c.json({ error: 'Failed to get OAuth redirect URL' }, 500);
  }
});

// Session management
app.post("/api/sessions", async (c) => {
  try {
    const body = await c.req.json();

    if (!body.code) {
      return c.json({ error: "No authorization code provided" }, 400);
    }

    const sessionToken = await exchangeCodeForSessionToken(body.code, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    // Get user info from Mocha Users Service
    const mochaUser = await getCurrentUser(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    if (mochaUser) {
      // Check if user exists in our database
      const existingUser = await c.env.DB.prepare(
        "SELECT * FROM users WHERE mocha_user_id = ? OR email = ?"
      ).bind(mochaUser.id, mochaUser.email).first();

      if (!existingUser) {
        // Create new user in our database
        await c.env.DB.prepare(`
          INSERT INTO users (mocha_user_id, email, first_name, last_name, role, is_verified)
          VALUES (?, ?, ?, ?, 'customer', TRUE)
        `).bind(
          mochaUser.id,
          mochaUser.email,
          mochaUser.google_user_data.given_name || '',
          mochaUser.google_user_data.family_name || ''
        ).run();
      } else {
        // Update last login
        await c.env.DB.prepare(
          "UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?"
        ).bind(existingUser.id).run();
      }
    }

    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      maxAge: 60 * 24 * 60 * 60, // 60 days
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Session creation error:', error);
    return c.json({ error: 'Failed to create session' }, 500);
  }
});

// Get current user
app.get("/api/users/me", authMiddleware, async (c) => {
  try {
    const mochaUser = c.get("user");
    
    if (!mochaUser) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    // Get enhanced user profile from our database
    const userProfile = await c.env.DB.prepare(
      "SELECT * FROM users WHERE mocha_user_id = ? OR email = ?"
    ).bind(mochaUser.id, mochaUser.email).first();

    const response: ApiResponse = {
      success: true,
      data: {
        ...userProfile,
        mochaUser,
      }
    };

    return c.json(response);
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ success: false, error: 'Failed to get user' }, 500);
  }
});

// User registration with role selection
app.post("/api/users/register", 
  zValidator("json", UserRegistrationSchema),
  async (c) => {
    try {
      const data = c.req.valid("json");

      // Check if user already exists
      const existingUser = await c.env.DB.prepare(
        "SELECT id FROM users WHERE email = ?"
      ).bind(data.email).first();

      if (existingUser) {
        return c.json({ 
          success: false, 
          error: 'User already exists with this email' 
        }, 400);
      }

      // Insert user into database
      const userResult = await c.env.DB.prepare(`
        INSERT INTO users (
          email, first_name, last_name, phone_number, company_name, role,
          is_active, is_verified, profile_completed, security_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        data.email,
        data.firstName,
        data.lastName,
        data.phoneNumber || null,
        data.companyName || null,
        data.role,
        true,
        false, // Will be verified via OAuth or OTP
        false,
        data.role === 'admin' ? 3 : 1
      ).run();

      const userId = userResult.meta.last_row_id;

      // Create user profile with role-specific data
      if (userId) {
        await c.env.DB.prepare(`
          INSERT INTO user_profiles (
            user_id, business_license, tax_id, business_type,
            annual_revenue, years_in_business, profile_data,
            verification_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          userId,
          data.businessLicense || null,
          data.taxId || null,
          data.businessType || null,
          data.annualRevenue || null,
          data.yearsInBusiness || null,
          JSON.stringify(data.profileData || {}),
          data.role === 'admin' ? 'manual_review' : 'pending'
        ).run();

        // Create security settings
        await c.env.DB.prepare(`
          INSERT INTO user_security_settings (
            user_id, password_expiry_days, require_password_change,
            login_notification_enabled, suspicious_activity_alerts,
            admin_approval_required
          ) VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          userId,
          data.role === 'admin' ? 30 : 90, // Admins have shorter password expiry
          data.role === 'admin',
          true,
          true,
          data.role === 'admin'
        ).run();
      }

      const response: ApiResponse = {
        success: true,
        message: 'Registration successful',
        data: { userId }
      };

      return c.json(response, 201);
    } catch (error) {
      console.error('Registration error:', error);
      return c.json({ 
        success: false, 
        error: 'Registration failed' 
      }, 500);
    }
  }
);

// Send OTP for verification
app.post("/api/otp/send",
  zValidator("json", OTPSchema.omit({ code: true })),
  async (c) => {
    try {
      const data = c.req.valid("json");

      // Generate OTP code
      const code = Math.random().toString().slice(2, 8); // 6-digit code
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database
      await c.env.DB.prepare(`
        INSERT INTO otp_codes (email, phone_number, code, otp_type, purpose, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        data.email || null,
        data.phoneNumber || null,
        code,
        data.otpType,
        data.purpose,
        expiresAt.toISOString()
      ).run();

      // In a real app, you would send the OTP via email/SMS here
      console.log(`OTP Code for ${data.email || data.phoneNumber}: ${code}`);

      const response: ApiResponse = {
        success: true,
        message: 'OTP sent successfully'
      };

      return c.json(response);
    } catch (error) {
      console.error('Send OTP error:', error);
      return c.json({ 
        success: false, 
        error: 'Failed to send OTP' 
      }, 500);
    }
  }
);

// Verify OTP
app.post("/api/otp/verify",
  zValidator("json", OTPSchema),
  async (c) => {
    try {
      const data = c.req.valid("json");

      // Find valid OTP
      const otp = await c.env.DB.prepare(`
        SELECT * FROM otp_codes 
        WHERE (email = ? OR phone_number = ?) 
        AND code = ? AND otp_type = ? AND purpose = ? 
        AND expires_at > CURRENT_TIMESTAMP 
        AND used_at IS NULL
        ORDER BY created_at DESC
        LIMIT 1
      `).bind(
        data.email || null,
        data.phoneNumber || null,
        data.code,
        data.otpType,
        data.purpose
      ).first();

      if (!otp) {
        return c.json({ 
          success: false, 
          error: 'Invalid or expired OTP' 
        }, 400);
      }

      // Mark OTP as used
      await c.env.DB.prepare(
        "UPDATE otp_codes SET used_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(otp.id).run();

      // Update user verification status
      if (data.purpose === 'registration' && data.email) {
        await c.env.DB.prepare(
          "UPDATE users SET is_verified = TRUE WHERE email = ?"
        ).bind(data.email).run();
      }

      if (data.purpose === 'phone_verification' && data.phoneNumber) {
        await c.env.DB.prepare(
          "UPDATE users SET phone_verified = TRUE WHERE phone_number = ?"
        ).bind(data.phoneNumber).run();
      }

      const response: ApiResponse = {
        success: true,
        message: 'OTP verified successfully'
      };

      return c.json(response);
    } catch (error) {
      console.error('Verify OTP error:', error);
      return c.json({ 
        success: false, 
        error: 'OTP verification failed' 
      }, 500);
    }
  }
);

// Admin endpoints (protected)
app.get("/api/admin/users", authMiddleware, async (c) => {
  try {
    const mochaUser = c.get("user");
    
    // Check if user is admin
    const userProfile = await c.env.DB.prepare(
      "SELECT role FROM users WHERE mocha_user_id = ? OR email = ?"
    ).bind(mochaUser?.id, mochaUser?.email).first();

    if (!userProfile || userProfile.role !== 'admin') {
      throw new HTTPException(403, { message: 'Admin access required' });
    }

    // Log admin access
    await c.env.DB.prepare(`
      INSERT INTO admin_access_logs (user_id, action, resource, ip_address, success)
      VALUES (?, 'LIST_USERS', 'admin/users', ?, TRUE)
    `).bind(userProfile.id, c.req.header('CF-Connecting-IP') || 'unknown').run();

    // Get all users
    const users = await c.env.DB.prepare(`
      SELECT u.*, up.verification_status, up.business_type
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      ORDER BY u.created_at DESC
    `).all();

    const response: ApiResponse = {
      success: true,
      data: users.results
    };

    return c.json(response);
  } catch (error) {
    console.error('Admin users list error:', error);
    if (error instanceof HTTPException) {
      throw error;
    }
    return c.json({ 
      success: false, 
      error: 'Failed to fetch users' 
    }, 500);
  }
});

// Admin access logs
app.get("/api/admin/access-logs", authMiddleware, async (c) => {
  try {
    const mochaUser = c.get("user");
    
    // Check if user is admin
    const userProfile = await c.env.DB.prepare(
      "SELECT id, role FROM users WHERE mocha_user_id = ? OR email = ?"
    ).bind(mochaUser?.id, mochaUser?.email).first();

    if (!userProfile || userProfile.role !== 'admin') {
      throw new HTTPException(403, { message: 'Admin access required' });
    }

    // Get access logs
    const logs = await c.env.DB.prepare(`
      SELECT al.*, u.email, u.first_name, u.last_name
      FROM admin_access_logs al
      JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 100
    `).all();

    const response: ApiResponse<AdminAccessLog[]> = {
      success: true,
      data: logs.results as AdminAccessLog[]
    };

    return c.json(response);
  } catch (error) {
    console.error('Admin access logs error:', error);
    if (error instanceof HTTPException) {
      throw error;
    }
    return c.json({ 
      success: false, 
      error: 'Failed to fetch access logs' 
    }, 500);
  }
});

// Logout
app.get('/api/logout', async (c) => {
  try {
    const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

    if (typeof sessionToken === 'string') {
      await deleteSession(sessionToken, {
        apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
        apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
      });
    }

    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
      maxAge: 0,
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ success: false, error: 'Logout failed' }, 500);
  }
});

export default app;
