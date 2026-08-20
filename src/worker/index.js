async function handleAuth(request, env) {
  const client_id = env.GITHUB_CLIENT_ID;
  const url = new URL(request.url);
  const redirectUrl = new URL("https://github.com/login/oauth/authorize");
  redirectUrl.searchParams.set("client_id", client_id);
  redirectUrl.searchParams.set("redirect_uri", url.origin + "/api/callback");
  redirectUrl.searchParams.set("scope", "repo user");
  redirectUrl.searchParams.set(
    "state",
    crypto.getRandomValues(new Uint8Array(12)).join(""),
  );
  return Response.redirect(redirectUrl.href, 301);
}

function renderCallbackBody(status, content) {
  const html = `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(content)}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
  `;
  return new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" },
  });
}

async function handleCallback(request, env) {
  const client_id = env.GITHUB_CLIENT_ID;
  const client_secret = env.GITHUB_CLIENT_SECRET;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "user-agent": "dla-cms-oauth",
          accept: "application/json",
        },
        body: JSON.stringify({ client_id, client_secret, code }),
      },
    );
    const result = await response.json();

    if (result.error) {
      return renderCallbackBody("error", result);
    }

    return renderCallbackBody("success", {
      token: result.access_token,
      provider: "github",
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

/* ── Formulario de contacto → proxy hacia Google Apps Script ── */

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function handleContacto(request, env) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ ok: false, error: "Content-Type inválido" }, 400);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "JSON inválido" }, 400);
  }

  // Honeypot: si viene con contenido, respondemos OK sin reenviar nada (bot ignorado silenciosamente)
  if (data.website) {
    return jsonResponse({ ok: true }, 200);
  }

  // Revalidación server-side de campos obligatorios
  if (
    !data.nombre?.trim() ||
    !data.tipoCaso?.trim() ||
    !data.telefono?.trim()
  ) {
    return jsonResponse(
      { ok: false, error: "Faltan campos obligatorios" },
      400,
    );
  }

  if (!env.APPS_SCRIPT_URL) {
    return jsonResponse(
      { ok: false, error: "Configuración del servidor incompleta" },
      500,
    );
  }

  try {
    const upstream = await fetch(env.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "content-type": "text/plain" }, // Apps Script espera text/plain en el body
      body: JSON.stringify({
        nombre: data.nombre?.trim() ?? "",
        tipoCaso: data.tipoCaso ?? "",
        aseguradora: data.aseguradora?.trim() ?? "",
        telefono: data.telefono?.trim() ?? "",
        email: data.email?.trim() ?? "",
        mensaje: data.mensaje?.trim() ?? "",
      }),
    });

    const upstreamText = await upstream.text();
    let upstreamData = null;
    try {
      upstreamData = JSON.parse(upstreamText);
    } catch {
      // Apps Script devolvió HTML (login page, error page) en vez de JSON
    }

    if (!upstream.ok || !upstreamData?.ok) {
      return jsonResponse(
        { ok: false, error: "Apps Script devolvió un error" },
        502,
      );
    }

    return jsonResponse({ ok: true }, 200);
  } catch {
    return jsonResponse(
      { ok: false, error: "No se pudo contactar el servicio de destino" },
      502,
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth") {
      return handleAuth(request, env);
    }
    if (url.pathname === "/api/callback") {
      return handleCallback(request, env);
    }
    if (url.pathname === "/api/contacto" && request.method === "POST") {
      return handleContacto(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
