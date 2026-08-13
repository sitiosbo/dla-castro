async function handleAuth(request, env) {
  const client_id = env.GITHUB_CLIENT_ID;
  const url = new URL(request.url);
  const redirectUrl = new URL('https://github.com/login/oauth/authorize');
  redirectUrl.searchParams.set('client_id', client_id);
  redirectUrl.searchParams.set('redirect_uri', url.origin + '/api/callback');
  redirectUrl.searchParams.set('scope', 'repo user');
  redirectUrl.searchParams.set(
    'state',
    crypto.getRandomValues(new Uint8Array(12)).join('')
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
    headers: { 'content-type': 'text/html;charset=UTF-8' },
  });
}

async function handleCallback(request, env) {
  const client_id = env.GITHUB_CLIENT_ID;
  const client_secret = env.GITHUB_CLIENT_SECRET;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'dla-cms-oauth',
        accept: 'application/json',
      },
      body: JSON.stringify({ client_id, client_secret, code }),
    });
    const result = await response.json();

    if (result.error) {
      return renderCallbackBody('error', result);
    }

    return renderCallbackBody('success', {
      token: result.access_token,
      provider: 'github',
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/auth') {
      return handleAuth(request, env);
    }
    if (url.pathname === '/api/callback') {
      return handleCallback(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
