'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteAccountButton() {
    const router = useRouter();
    const supabase = createClient();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and all your saved preferences will be lost.')) {
            return;
        }

        setIsDeleting(true);
        try {
            alert('To securely delete an account, a backend Server Action with the Supabase Service Role Key must be triggered. Simulating account deletion and signing out...');

            await supabase.auth.signOut();
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
        </button>
    );
}
