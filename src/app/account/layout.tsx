import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { redirect } from 'next/navigation';
import AccountTabs from './AccountTabs';

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <nav className="fixed top-0 w-full z-50 glass border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="text-brand-600">
                            <Logo className="w-8 h-8" />
                        </div>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            Getlanded
                        </span>
                    </Link>
                    <div className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Link href="/jobs" className="hover:text-brand-600 transition-colors">Jobs</Link>
                        <Link href="/companies" className="hover:text-brand-600 transition-colors">Companies</Link>
                        <Link href="/applied" className="hover:text-brand-600 transition-colors">Applied</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/account/profile" className="text-brand-600 font-semibold">Account</Link>
                        <form action="/auth/signout" method="post">
                            <button type="submit" className="hover:text-brand-600 transition-colors">Sign out</button>
                        </form>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto pt-28 px-4 sm:px-6 lg:px-8 pb-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                        Account Settings
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage your profile, preferences, and subscription details.
                    </p>
                </div>

                <div className="bg-white dark:bg-[#0B1120] border border-[var(--border)] rounded-md shadow-sm overflow-hidden">
                    {/* Tabs Component (Client Side) */}
                    <AccountTabs />

                    <div className="p-6 sm:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
