import { createCookieSessionStorage } from '@remix-run/node'; // or cloudflare/deno

const secret: string = process.env.SECRET_KEY as string;

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60,
      sameSite: 'lax',
      secrets: [secret],
      secure: process.env.NODE_ENV === 'production',
    },
  });

export { getSession, commitSession, destroySession };
