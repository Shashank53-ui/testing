import { CheckCircle2 } from 'lucide-react';

export default function SubscriptionPage() {
    return (
        <div className="max-w-3xl">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Subscription</h2>
                <p className="text-slate-500 dark:text-slate-400">View and manage your billing plan.</p>
            </div>

            <div className="border border-[var(--border)] rounded-lg p-8 bg-slate-50 dark:bg-slate-900/20">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Free Plan <span className="text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 px-2.5 py-0.5 rounded-full">Current</span>
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                            Access to the public database of sponsored jobs with basic filtering.
                        </p>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-brand-500" />
                        <span>Browse 1000+ UK Sponsored Jobs</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-brand-500" />
                        <span>Search Companies database</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-brand-500" />
                        <span>Save Profile Preferences</span>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                    <button className="bg-brand-600 hover:bg-brand-500 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-colors text-sm">
                        Upgrade Plan (Coming Soon)
                    </button>
                </div>
            </div>
        </div>
    );
}
