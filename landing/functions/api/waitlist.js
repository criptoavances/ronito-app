// Waitlist endpoint: stores signups in the WAITLIST KV namespace.
// Key = normalized email, value = signup metadata. Duplicate signups
// simply overwrite the same key, so the list stays deduplicated.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid-json" }, 400);
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: "invalid-email" }, 400);
  }

  const lang = ["en", "es", "de"].includes(body.lang) ? body.lang : "en";

  await env.WAITLIST.put(
    email,
    JSON.stringify({
      email,
      lang,
      ts: new Date().toISOString(),
      country: request.cf?.country || "",
      referer: request.headers.get("referer") || "",
    })
  );

  return json({ ok: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
