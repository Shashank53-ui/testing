import Link from 'next/link';
import { Suspense } from 'react';
import { createClient } from '../../utils/supabase/server';
import CompanyFeed from '../../components/companies/CompanyFeed';
import { getCompanies } from '../../app/actions/companyActions';
import Logo from '../../components/Logo';

export const dynamic = 'force-dynamic';

export default async function CompaniesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string; sort?: string; view?: string }>;
}) {
    const { page: pageParam, q, sort, view } = await searchParams;
    const query = (q || '').trim();
    const currentSort = sort || 'alphabetical';
    const page = Math.max(1, parseInt(pageParam || '1'));
    const isFavoritesView = view === 'favorites';

    const serverSupabase = await createClient();
    const { data: { user } } = await serverSupabase.auth.getUser();

    const { companies, totalPages } = await getCompanies({
        page,
        q: query,
        sort: currentSort,
        favoritesOnly: isFavoritesView
    });

    const companyList = companies || [];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Navigation */}
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
                        <Link href="/companies" className="text-brand-600 font-semibold border-b-2 border-brand-600 pb-1">Companies</Link>
                        <Link href="/applied" className="hover:text-brand-600 transition-colors">Applied</Link>
                        {user ? (
                            <Link href="/account/profile" className="bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 px-5 py-2 flex items-center gap-2 rounded-none transition-colors border border-[var(--border)] font-medium">
                                Account
                            </Link>
                        ) : (
                            <Link href="/login" className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-none transition-colors shadow-sm font-medium">
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Full-height 3-column layout — exactly below fixed nav */}
            <main className="mt-16 flex h-[calc(100vh-4rem)] overflow-hidden">
                {/* Left Sidebar */}
                <div className="hidden lg:flex flex-col w-48 border-r border-[var(--border)] bg-[var(--background)] shrink-0 p-3 gap-1 pt-4">
                    <Link
                        href="/companies"
                        className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2.5 transition-colors ${!isFavoritesView ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <span className="text-base text-slate-600">🏢</span>
                        <span>All</span>
                    </Link>
                    <Link
                        href="/companies?view=favorites"
                        className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2.5 transition-colors ${isFavoritesView ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <span className="text-base text-brand-600">⭐</span>
                        <span>Favorites</span>
                    </Link>
                </div>

                {/* Middle + Right: Feed — fills remaining space, overflow handled inside */}
                <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
                    <CompanyFeed
                        initialCompanies={companyList as any}
                        initialTotalPages={totalPages}
                        searchParams={{ q: query, sort: currentSort, view }}
                    />
                </div>
            </main>
        </div>
    );
}
