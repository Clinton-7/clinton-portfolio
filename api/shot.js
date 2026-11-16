// Screenshot proxy: fetches a capture from WordPress mShots, and caches real ones on
// Vercel's edge for a week so visitors never wait on (or get throttled by) mShots.
const ALLOWED = new Set([
  "ayaditherapy.com", "www.revolutionbeauty.com", "www.headmasters.com", "rosy-longevity.club",
  "sunnydayselectrical.com.au", "ilelectrician.com", "uk.swedencare.com", "www.xpresslogistic.co.uk",
  "www.verdantas.com", "primehometrends.ca", "uniteclean.co.uk",
]);

module.exports = async (req, res) => {
  const q = req.query || {};
  let target;
  try { target = new URL(q.u); } catch (e) { res.statusCode = 400; return res.end("bad url"); }
  if (!ALLOWED.has(target.hostname)) { res.statusCode = 403; return res.end("not allowed"); }

  const mobile = q.m === "1";
  const qs = mobile ? "vpw=414&vph=896&w=414&h=896" : `w=${Math.min(+q.w || 1280, 1280)}&h=${Math.min(+q.h || 960, 960)}`;
  const src = `https://s0.wp.com/mshots/v1/${encodeURIComponent(target.href)}?${qs}`;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    const r = await fetch(src, { signal: ctrl.signal, redirect: "follow" });
    clearTimeout(t);
    const type = r.headers.get("content-type") || "";
    const buf = Buffer.from(await r.arrayBuffer());
    if (!r.ok || type.includes("gif") || buf.length < 35000) {
      // still generating (or failed): tell the browser to try again shortly, don't cache
      res.statusCode = 202;
      res.setHeader("Cache-Control", "no-store");
      return res.end("pending");
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", type || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800");
    return res.end(buf);
  } catch (e) {
    res.statusCode = 202;
    res.setHeader("Cache-Control", "no-store");
    return res.end("pending");
  }
};
