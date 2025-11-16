import { headers } from 'next/headers';

export type HeadersType = Awaited<ReturnType<typeof headers>>;
