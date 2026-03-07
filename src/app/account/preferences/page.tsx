import PreferencesForm from './PreferencesForm';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default async function PreferencesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let initialData = null;
    if (user) {
        const { data } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single();
        initialData = data;
    }

    return (
        <div className="max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Your job preferences
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Customize your feed to see the roles that match your career goals.
                </p>
            </div>

            <PreferencesForm initialData={initialData} />
        </div>
    );
}
