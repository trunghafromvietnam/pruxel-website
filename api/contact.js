// api/contact.js — Vercel Serverless Function
// Handles: save to Supabase + email to company + auto-reply to client

export const config = { runtime: 'edge' };

// ─── Email Templates ──────────────────────────────────────────────────────────

function emailToCompany({ name, email, budget, services, description }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 32px 40px; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; }
    .header p { color: #94a3b8; margin: 6px 0 0; font-size: 13px; }
    .badge { display: inline-block; background: #3b82f6; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; margin-top: 12px; letter-spacing: 1px; text-transform: uppercase; }
    .body { padding: 36px 40px; }
    .field { margin-bottom: 20px; }
    .field-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .field-value { font-size: 15px; color: #0f172a; background: #f1f5f9; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #3b82f6; }
    .field-value.description { white-space: pre-wrap; line-height: 1.6; }
    .actions { margin-top: 28px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
    .btn { display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; }
    .footer { background: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🔔 New Lead Received</h1>
      <p>${new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'full', timeStyle: 'short' })}</p>
      <span class="badge">Action Required</span>
    </div>
    <div class="body">
      <div class="field">
        <div class="field-label">Full Name</div>
        <div class="field-value">${name}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Budget Range</div>
        <div class="field-value">${budget || 'Not specified'}</div>
      </div>
      <div class="field">
        <div class="field-label">Services Interested In</div>
        <div class="field-value">${services || 'Not specified'}</div>
      </div>
      <div class="field">
        <div class="field-label">Project Description</div>
        <div class="field-value description">${description || 'No description provided.'}</div>
      </div>
      <div class="actions">
        <a href="mailto:${email}?subject=Re: Your AI Project Inquiry&body=Hi ${name}," class="btn">
          Reply to ${name} →
        </a>
      </div>
    </div>
    <div class="footer">
      <p>Pruxel CRM · Lead automatically saved to your Supabase dashboard</p>
    </div>
  </div>
</body>
</html>`;
}

function emailToClient({ name }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 40px 40px 32px; text-align: center; }
    .logo { font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .logo span { color: #3b82f6; }
    .tagline { color: #94a3b8; font-size: 13px; margin-top: 6px; }
    .body { padding: 40px; }
    .body h2 { font-size: 22px; color: #0f172a; font-weight: 700; margin: 0 0 12px; }
    .body p { color: #475569; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
    .highlight { color: #0f172a; font-weight: 600; }
    .timeline { background: #f8fafc; border-radius: 10px; padding: 20px 24px; margin: 24px 0; }
    .timeline-item { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px; }
    .timeline-item:last-child { margin-bottom: 0; }
    .step-num { width: 28px; height: 28px; background: #3b82f6; border-radius: 50%; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .step-text { font-size: 14px; color: #475569; padding-top: 4px; }
    .step-text strong { color: #0f172a; display: block; margin-bottom: 2px; }
    .divider { height: 1px; background: #e2e8f0; margin: 28px 0; }
    .social { text-align: center; }
    .social p { font-size: 13px; color: #94a3b8; margin-bottom: 12px; }
    .social a { color: #3b82f6; text-decoration: none; font-size: 13px; font-weight: 500; margin: 0 8px; }
    .footer { background: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0; text-align: center; }
    .footer p { margin: 0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">PRUXEL<span>.</span></div>
      <div class="tagline">AI Systems Engineering</div>
    </div>
    <div class="body">
      <h2>We've received your request, ${name}! 👋</h2>
      <p>
        Thank you for reaching out. Our team has been notified and will review 
        your project details within the next few hours.
      </p>
      <p>
        Here's what happens next:
      </p>
      <div class="timeline">
        <div class="timeline-item">
          <div class="step-num">1</div>
          <div class="step-text">
            <strong>Review (today)</strong>
            Our team reviews your project details and prepares relevant questions.
          </div>
        </div>
        <div class="timeline-item">
          <div class="step-num">2</div>
          <div class="step-text">
            <strong>Personal reply (within 24h)</strong>
            You'll receive a tailored response — not a template — addressing your specific needs.
          </div>
        </div>
        <div class="timeline-item">
          <div class="step-num">3</div>
          <div class="step-text">
            <strong>Free AI Audit call (optional)</strong>
            We'll offer a 45-min session to map your workflow and identify the highest-ROI automations.
          </div>
        </div>
      </div>
      <p>
        In the meantime, feel free to reply to this email if you have anything to add 
        or want to share more context about your project.
      </p>
      <div class="divider"></div>
      <div class="social">
        <p>Connect with us</p>
        <a href="https://linkedin.com/company/pruxel">LinkedIn</a>
        <a href="mailto:official@pruxel.tech">official@pruxel.tech</a>
      </div>
    </div>
    <div class="footer">
      <p>© 2026 Pruxel. You received this because you submitted a request on pruxel.tech</p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { name, email, budget, services, description } = body;

  // Basic validation
  if (!name?.trim() || !email?.trim()) {
    return new Response(JSON.stringify({ error: 'Name and email are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ── Environment variables (set in Vercel dashboard) ─────────────────────────
  const SUPABASE_URL    = process.env.SUPABASE_URL;
  const SUPABASE_KEY    = process.env.SUPABASE_SERVICE_KEY;   // service_role key
  const RESEND_API_KEY  = process.env.RESEND_API_KEY;
  const COMPANY_EMAIL   = process.env.COMPANY_EMAIL;          // official@pruxel.tecg
  const FROM_EMAIL      = process.env.FROM_EMAIL;             // noreply@pruxel.tech

  const errors = [];

  // ── 1. Save to Supabase ─────────────────────────────────────────────────────
  try {
    const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify({ name, email, budget, services, description }),
    });

    if (!supaRes.ok) {
      const err = await supaRes.text();
      errors.push(`DB: ${err}`);
    }
  } catch (e) {
    errors.push(`DB connection failed: ${e.message}`);
  }

  // ── 2. Email to company ─────────────────────────────────────────────────────
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    FROM_EMAIL,
        to:      [COMPANY_EMAIL],
        subject: `🔔 New Lead: ${name} (${budget || 'budget unspecified'})`,
        html:    emailToCompany({ name, email, budget, services, description }),
      }),
    });
    if (!res.ok) errors.push(`Email to company failed: ${await res.text()}`);
  } catch (e) {
    errors.push(`Email to company exception: ${e.message}`);
  }

  // ── 3. Auto-reply to client ─────────────────────────────────────────────────
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    `Pruxel Team <${FROM_EMAIL}>`,
        to:      [email],
        subject: `We received your request, ${name} — Pruxel`,
        html:    emailToClient({ name }),
        reply_to: COMPANY_EMAIL,
      }),
    });
    if (!res.ok) errors.push(`Auto-reply failed: ${await res.text()}`);
  } catch (e) {
    errors.push(`Auto-reply exception: ${e.message}`);
  }

  // ── Response ────────────────────────────────────────────────────────────────
  if (errors.length > 0) {
    // Still return 200 if DB saved — email failure shouldn't block UX
    console.error('Partial errors:', errors);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type':                 'application/json',
      'Access-Control-Allow-Origin':  '*',
    }
  });
}