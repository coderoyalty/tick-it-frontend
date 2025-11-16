'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
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
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(50, 'Name must be at most 50 characters.'),
  email: z.email(),
  password: z
    .string()
    .min(6, 'Description must be at least 6 characters.')
    .max(50, 'Description must be at most 50 characters.'),
});

export default function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  const { data, isFetched, isLoading } = useUser();

  React.useEffect(() => {
    if (isFetched && !isLoading && data) {
      router.replace('/');
    }
  }, [data, isLoading, isFetched, router]);

  const signupMutation = useMutation({
    mutationFn: async (data: any) => api.post('/auth/signup', data),

    onSuccess: () => {
      router.push('/login');
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await signupMutation.mutateAsync(data);
  }

  return (
    <form
      id="login-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  {...field}
                  placeholder="e.g John Doe"
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
                <FieldLabel htmlFor="password">Password</FieldLabel>

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
                  disabled={
                    signupMutation.isPending || isLoading || data !== null
                  }
                  className="w-full"
                >
                  {signupMutation.isPending && <Spinner />} Submit
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </>
          )}
        />
      </FieldGroup>
    </form>
  );
}
