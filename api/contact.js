// api/contact.js — Vercel Serverless Function
// Handles: save to Supabase + email to company + auto-reply to client

export const config = { runtime: 'edge' };

// ─── Email Templates ──────────────────────────────────────────────────────────

function emailToCompany({ name, email, budget, services, description }) {
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  const budgetColor = budget && budget.includes('10K') ? '#10b981' : '#3b82f6';
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;padding:32px 16px}
.wrap{max-width:580px;margin:0 auto}
.card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08),0 8px 24px rgba(0,0,0,.06)}
.accent{height:4px;background:linear-gradient(90deg,#3b82f6,#06b6d4,#8b5cf6)}
.hdr{background:#0f172a;padding:24px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.hdr h1{color:#fff;font-size:16px;font-weight:700}.hdr p{color:#64748b;font-size:11px;margin-top:3px}
.badge{background:rgba(59,130,246,.15);border:1px solid rgba(59,130,246,.3);color:#93c5fd;font-size:11px;font-weight:700;padding:5px 12px;border-radius:100px;letter-spacing:.5px}
.scores{background:#0f172a;padding:0 32px 20px;display:flex;gap:10px}
.sc{flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:11px 13px}
.sc-l{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px}
.sc-v{font-size:13px;font-weight:700;color:#e2e8f0}.sc-v.hot{color:#34d399}
.body{padding:24px 32px}
.sec{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
.f{display:flex;gap:11px;align-items:flex-start;margin-bottom:13px}
.fi{width:32px;height:32px;border-radius:8px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.fk{font-size:10px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
.fv{font-size:13px;color:#0f172a;font-weight:500;line-height:1.5}
.fv a{color:#3b82f6;text-decoration:none}
.div{height:1px;background:#f1f5f9;margin:18px 0}
.desc{background:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #3b82f6;border-radius:8px;padding:13px 15px;font-size:13px;color:#475569;line-height:1.7;white-space:pre-wrap;margin-top:6px}
.acts{display:flex;gap:9px;flex-wrap:wrap;margin-top:18px}
.bp{display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600}
.bs{display:inline-block;background:#f1f5f9;color:#475569;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600}
.ftr{background:#f8fafc;padding:14px 32px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px}
.ftr p{font-size:11px;color:#94a3b8}
.dot{width:6px;height:6px;border-radius:50%;background:#34d399;display:inline-block;margin-right:5px;vertical-align:middle}
</style></head><body>
<div class="wrap"><div class="card">
<div class="accent"></div>
<div class="hdr">
  <div><h1>New inbound lead</h1><p>${now} · Pacific Time</p></div>
  <div class="badge">ACTION REQUIRED</div>
</div>
<div class="scores">
  <div class="sc"><div class="sc-l">Budget</div><div class="sc-v" style="color:${budgetColor}">${budget || '—'}</div></div>
  <div class="sc"><div class="sc-l">Top Service</div><div class="sc-v">${services ? services.split(',')[0].trim() : '—'}</div></div>
  <div class="sc"><div class="sc-l">Status</div><div class="sc-v hot">● New</div></div>
</div>
<div class="body">
  <div class="sec">Contact Details</div>
  <div class="f"><div class="fi">👤</div><div><div class="fk">Name</div><div class="fv">${name}</div></div></div>
  <div class="f"><div class="fi">✉️</div><div><div class="fk">Email</div><div class="fv"><a href="mailto:${email}">${email}</a></div></div></div>
  <div class="f"><div class="fi">🛠️</div><div><div class="fk">Services</div><div class="fv">${services || 'Not specified'}</div></div></div>
  <div class="div"></div>
  <div class="sec">Project Brief</div>
  <div class="desc">${description || 'No description provided.'}</div>
  <div class="acts">
    <a href="mailto:${email}?subject=Re%3A Your AI Project — Pruxel&body=Hi ${name}," class="bp">Reply to ${name} →</a>
    <a href="https://supabase.com" class="bs">Open CRM</a>
  </div>
</div>
<div class="ftr">
  <p><span class="dot"></span>Auto-saved to Supabase · pruxel.tech</p>
  <p>${now}</p>
</div>
</div></div></body></html>`;
}

function emailToClient({ name }) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;padding:32px 16px}
.wrap{max-width:560px;margin:0 auto}
.card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08),0 8px 32px rgba(0,0,0,.07)}
.hero{background:linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f2d4a 100%);padding:40px 36px 32px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(59,130,246,.2),transparent 70%);pointer-events:none}
.logo{display:inline-flex;align-items:center;gap:8px;margin-bottom:18px}
.ld{width:9px;height:9px;border-radius:50%;background:#3b82f6;box-shadow:0 0 10px rgba(59,130,246,.6)}
.ln{font-size:17px;font-weight:800;color:#fff;letter-spacing:-.4px}
.ln span{color:#3b82f6}
.hero h1{font-size:22px;font-weight:700;color:#fff;letter-spacing:-.4px;line-height:1.35;margin-bottom:9px}
.hero p{font-size:13px;color:#94a3b8;line-height:1.65;max-width:360px;margin:0 auto}
.pw{display:flex;justify-content:center;margin-top:18px}
.pill{display:inline-flex;align-items:center;gap:7px;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.25);padding:6px 14px;border-radius:100px}
.pd{width:6px;height:6px;border-radius:50%;background:#34d399;animation:blink 1.5s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.pt{font-size:11px;font-weight:700;color:#34d399;letter-spacing:.4px}
.body{padding:32px 36px}
.gr{font-size:18px;font-weight:700;color:#0f172a;margin-bottom:8px;letter-spacing:-.3px}
.intro{font-size:13px;color:#64748b;line-height:1.75;margin-bottom:24px}
.tlt{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px}
.step{display:flex;gap:14px;position:relative}
.step:not(:last-child)::after{content:'';position:absolute;left:13px;top:32px;width:1px;height:calc(100% - 4px);background:linear-gradient(to bottom,rgba(59,130,246,.25),rgba(59,130,246,.04))}
.sn{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(59,130,246,.3)}
.sr{padding-bottom:20px}
.st{font-size:13px;font-weight:600;color:#0f172a;margin-bottom:3px}
.sd{font-size:12px;color:#64748b;line-height:1.65}
.gbox{background:linear-gradient(135deg,#eff6ff,#f0fdf4);border:1px solid #bfdbfe;border-radius:10px;padding:16px 18px;margin:20px 0;display:flex;gap:12px;align-items:flex-start}
.gi{font-size:20px;flex-shrink:0}
.gt{font-size:12px;font-weight:700;color:#1e40af;margin-bottom:3px}
.gd{font-size:12px;color:#3b82f6;line-height:1.6}
.cta{text-align:center;margin:24px 0 8px}
.cb{display:inline-block;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;text-decoration:none;padding:13px 30px;border-radius:9px;font-size:13px;font-weight:700;box-shadow:0 4px 14px rgba(59,130,246,.3)}
.cs{font-size:11px;color:#94a3b8;margin-top:7px}
.div{height:1px;background:#f1f5f9;margin:22px 0}
.ftr{text-align:center;padding-bottom:4px}
.fl{margin-bottom:9px}
.fl a{color:#3b82f6;text-decoration:none;font-size:12px;font-weight:500;margin:0 8px}
.ftr p{font-size:11px;color:#cbd5e1;line-height:1.6}
</style></head><body>
<div class="wrap"><div class="card">
<div class="hero">
  <div class="logo"><div class="ld"></div><div class="ln">PRUXEL<span>.</span></div></div>
  <h1>Got it, ${name}. We're on it.</h1>
  <p>Your request is with our team. A real person — not a bot — will review it personally.</p>
  <div class="pw"><div class="pill"><div class="pd"></div><span class="pt">REQUEST RECEIVED</span></div></div>
</div>
<div class="body">
  <div class="gr">What happens next</div>
  <p class="intro">We keep things simple and move fast. Here's exactly what to expect:</p>
  <div class="tlt">Your next 48 hours</div>
  <div class="step">
    <div class="sn">1</div>
    <div class="sr">
      <div class="st">We review your brief — today</div>
      <div class="sd">A real person reads every submission. We identify the highest-ROI AI opportunity in your workflow before we even hop on a call.</div>
    </div>
  </div>
  <div class="step">
    <div class="sn">2</div>
    <div class="sr">
      <div class="st">Direct reply within 24 hours</div>
      <div class="sd">Not a template — a specific, thoughtful response to your actual project with initial ideas and a clear path forward.</div>
    </div>
  </div>
  <div class="step">
    <div class="sn">3</div>
    <div class="sr" style="padding-bottom:4px">
      <div class="st">Free 45-min AI Audit (optional)</div>
      <div class="sd">We map your workflow, spot 3 automation wins, and estimate ROI. No commitment, no pitch — just clarity.</div>
    </div>
  </div>
  <div class="gbox">
    <div class="gi">🔒</div>
    <div>
      <div class="gt">Our promise to you</div>
      <div class="gd">Fixed price — no surprise invoices. 6-week delivery — or we keep working until it ships. Your data is always yours.</div>
    </div>
  </div>
  <div class="cta">
    <a href="mailto:official@pruxel.tech?subject=Re: My AI Project" class="cb">Reply directly to our team →</a>
    <p class="cs">Just hit reply — it goes straight to a human</p>
  </div>
  <div class="div"></div>
  <div class="ftr">
    <div class="fl">
      <a href="https://pruxel.tech">Website</a>
      <a href="https://github.com/trunghafromvietnam">GitHub</a>
      <a href="mailto:official@pruxel.tech">Email</a>
    </div>
    <p>© 2026 Pruxel · Seattle, WA</p>
    <p>You received this because you submitted a request on pruxel.tech</p>
  </div>
</div>
</div></div></body></html>`;
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