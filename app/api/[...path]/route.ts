import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function proxyApi(request: Request) {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get('token')?.value;
  const pathname = new URL(request.url).pathname;
  const targetPath = pathname.replace('/api', '');

  const headers = new Headers(request.headers);
  headers.delete('cookie');

  if (jwtToken) {
    headers.set('Authorization', `Bearer ${jwtToken}`);
  }

  console.log(API_BASE_URL);

  const finalUrl = `${API_BASE_URL}${targetPath}`;

  let duplexOption: any | undefined = undefined;

  const hasBody =
    request.headers.has('content-length') &&
    parseInt(request.headers.get('content-length') || '0', 10) > 0;

  if (['POST', 'PUT', 'PATCH'].includes(request.method) && hasBody) {
    duplexOption = 'half';
  }

  const requestOptions: RequestInit & { duplex?: any } = {
    method: request.method,
    body: request.body,
    cache: request.cache,
    headers: headers,
    duplex: duplexOption,
  };

  try {
    const response = await fetch(finalUrl, requestOptions);

    return new NextResponse(response.body, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Backend service unavailable.' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

export {
  proxyApi as GET,
  proxyApi as POST,
  proxyApi as PUT,
  proxyApi as PATCH,
  proxyApi as DELETE,
};
