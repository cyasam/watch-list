import { redirect } from '@remix-run/node';
import { prisma } from './database.server';
import { compare, genSalt, hash } from 'bcrypt';
import { commitSession, getSession } from './sessions.server';

export const getUserSession = async (cookie: any) => {
  const session = await getSession(cookie);

  if (!session.has('id')) {
    return null;
  }

  const id = session.get('id');
  const fullname = session.get('fullname');
  const email = session.get('email');

  return { id, fullname, email };
};

const createUserSession = async (user: any) => {
  const session = await getSession();
  if (!user?.id) {
    session.flash('error', 'Invalid username/password');
    return redirect('/');
  }

  session.set('id', user.id);
  session.set('fullname', user.fullname);
  session.set('email', user.email);

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export const signup = async ({ email, password, fullname }: any) => {
  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser) {
    const error: any = new Error('User exists.');

    error.status = 422;
    throw error;
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  const newUser = await prisma.user.create({
    data: { email, password: hashedPassword, fullname },
  });

  return await createUserSession(newUser);
};

export const login = async ({ email, password }: any) => {
  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (!existingUser) {
    const error: any = new Error('Invalid username/password');

    error.status = 422;
    throw error;
  }

  const comparePassword = await compare(password, existingUser.password);

  if (!comparePassword) {
    const error: any = new Error('Invalid username/password');

    error.status = 422;
    throw error;
  }

  return await createUserSession(existingUser);
};
