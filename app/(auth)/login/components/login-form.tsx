'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Button } from '@/components/ui/button';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';

const formSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, 'Description must be at least 6 characters.')
    .max(50, 'Description must be at most 50 characters.'),
});

export default function LoginForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) =>
      api.post('/auth/login', credentials),
    onSuccess: () => {
      //TODO: invalidate and fetmmch the user state

      toast.success('Login successful!');
      router.push('/'); //TODO: redirect to dashboard
    },

    onError: (error: any) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // const { data, isFetched, isLoading } = useUser();

  // React.useEffect(() => {
  //   if (isFetched && !isLoading && data) {
  //     router.replace('/');
  //   }
  // }, [data, isLoading, isFetched, router]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await loginMutation.mutateAsync(data);
  }

  return (
    <form
      id="login-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  {...field}
                  placeholder="m@example.com"
                  aria-invalid={fieldState.invalid}
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            </>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <>
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  {...field}
                  id="password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g Abcd123@"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
              <Field>
                <Button
                  type="submit"
                  form="login-form"
                  disabled={loginMutation.isPending}
                  className="w-full"
                >
                  {loginMutation.isPending && <Spinner />} Login
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </>
          )}
        />
      </FieldGroup>
    </form>
  );
}
