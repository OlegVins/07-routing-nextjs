'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { useParams } from 'next/navigation';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

import css from './NotesPage.module.css';

export default function NotesClient() {
    const { slug } = useParams();
    const tagFromUrl =
        Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined;
    const tag = tagFromUrl === 'all' ? undefined : tagFromUrl;
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleSearch = useDebouncedCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, 500);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['notes', { page, search }, tag],
        queryFn: () => fetchNotes(page, search, tag === 'all' ? undefined : tag),
        placeholderData: keepPreviousData,
    });

    const notes = data?.notes ?? [];
    const totalPages = data?.totalPages ?? 0;

    if (isLoading) return <p>Loading please wait...</p>;
    if (isError) return <p>Something went wrong</p>;

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox
                    onChange={(value) => handleSearch(value)}
                />

                {totalPages > 1 && (
                    <Pagination
                        pageCount={totalPages}
                        currentPage={page}
                        onPageChange={setPage}
                    />
                )}

                <button className={css.button}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create note +
                </button>
            </header>

            { notes.length > 0 && 
                <NoteList notes={notes}
                />
            }

            {isModalOpen && (
                <Modal onClose={() =>
                    setIsModalOpen(false)}>
                    <NoteForm onClose={() =>
                        setIsModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
}