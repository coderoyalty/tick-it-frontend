import { CheckCircle2Icon } from 'lucide-react';
import LoginForm from './components/login-form';
import Link from 'next/link';
import { FireworksBackground } from '@/components/animate-ui/components/backgrounds/fireworks';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import api from '@/lib/axios';

export async function getUser() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const res = await api.get('/auth/me', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return res.data;
  } catch (err) {
    return null;
  }
}

export default async function LoginPage() {
  const queryClient = new QueryClient();

  const data = await getUser();

  queryClient.setQueryData(['user'], data);

  if (data) {
    return redirect('/');
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 font-medium text-xl"
            >
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded">
                <CheckCircle2Icon className="size-4" />
              </div>
              TickIt
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          {/* <img
          src="https://placehold.co/1080x860/png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
          <FireworksBackground />
        </div>
      </div>
    </HydrationBoundary>
  );
}
