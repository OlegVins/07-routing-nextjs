import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotesClient from '../../Notes.client';
import { fetchNotes } from '@/lib/api';

export default async function Page({
  params,
}: {
    params: { slug?: string[] };
}) {
    const tag = params.slug?.[0];
    
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
      queryFn: () =>
          fetchNotes(1, '', tag === 'all' ? undefined : tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}