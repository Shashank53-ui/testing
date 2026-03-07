'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';

export default function CompanySearchBar({ initialQuery, initialSort = 'jobs_desc' }: { initialQuery: string; initialSort?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentSort, setCurrentSort] = useState(initialSort);

    function handleUpdate(searchQuery: string, sortValue: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery.trim()) {
            params.set('q', searchQuery.trim());
        } else {
            params.delete('q');
        }

        if (sortValue && sortValue !== 'jobs_desc') {
            params.set('sort', sortValue);
        } else {
            params.delete('sort');
        }

        params.delete('page'); // reset to page 1 on new search or sort
        startTransition(() => {
            router.push(`/companies?${params.toString()}`);
        });
    }

    function handleClear() {
        if (inputRef.current) inputRef.current.value = '';
        handleUpdate('', currentSort);
    }

    return (
        <div className="relative max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
            <div className={`flex-1 flex items-center bg-[var(--card)] border ${isPending ? 'border-brand-400' : 'border-[var(--border)]'} rounded-2xl shadow-sm px-4 py-3 gap-3 transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100`}>
                <Search className={`w-5 h-5 shrink-0 transition-colors ${isPending ? 'text-brand-500' : 'text-slate-400'}`} />
                <input
                    ref={inputRef}
                    type="text"
                    defaultValue={initialQuery}
                    placeholder="Search companies..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm"
                    onChange={(e) => {
                        const val = e.target.value;
                        // Debounce: only search after user pauses typing 300ms
                        clearTimeout((window as any).__companySearchTimer);
                        (window as any).__companySearchTimer = setTimeout(() => {
                            handleUpdate(val, currentSort);
                        }, 300);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            clearTimeout((window as any).__companySearchTimer);
                            handleUpdate((e.target as HTMLInputElement).value, currentSort);
                        }
                    }}
                />
                {initialQuery && (
                    <button onClick={handleClear} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Sort Dropdown */}
            <div className="sm:w-48 shrink-0">
                <select
                    value={currentSort}
                    onChange={(e) => {
                        const newSort = e.target.value;
                        setCurrentSort(newSort);
                        handleUpdate(inputRef.current?.value || '', newSort);
                    }}
                    className="w-full h-full min-h-[50px] bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm px-4 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-colors appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                >
                    <option value="jobs_desc">Most Roles</option>
                    <option value="alphabetical">Name (A-Z)</option>
                    <option value="alphabetical_desc">Name (Z-A)</option>
                    <option value="jobs_asc">Least Roles</option>
                </select>
            </div>

            {isPending && (
                <div className="absolute right-4 sm:right-[13.5rem] top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}
