'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AccountTabs() {
    const pathname = usePathname();

    const tabs = [
        { name: 'Profile', href: '/account/profile' },
        { name: 'Subscription', href: '/account/subscription' },
        { name: 'Preferences', href: '/account/preferences' },
    ];

    return (
        <div className="border-b border-[var(--border)] bg-slate-50 dark:bg-slate-900/50">
            <nav className="flex space-x-8 px-6 sm:px-8" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${isActive
                                    ? 'border-brand-600 text-brand-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-600'}
                            `}
                        >
                            {tab.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
