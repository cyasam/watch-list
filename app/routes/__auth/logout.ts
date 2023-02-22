import type { ActionArgs } from '@remix-run/node';
import { redirect } from 'react-router';
import { destroySession, getSession } from '~/data/sessions.server';

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}
