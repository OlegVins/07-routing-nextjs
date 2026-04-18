'use client';

import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import NotePreview from '@/components/NotePreview/NotePreview';

export default function ModalPreview() {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };
    return (
        <Modal onClose={handleClose}>
            <NotePreview  />
        </Modal>
    );
}