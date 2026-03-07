'use client';

import { useState, useEffect, useRef } from 'react';
import { Building, Globe, Linkedin, ChevronLeft, MapPin, Briefcase, ChevronRight, AlertTriangle, Star } from 'lucide-react';
import { getCompanies, Company, toggleFavoriteCompany, getFavoriteCompanyIds } from '../../app/actions/companyActions';
import { getJobs, Job } from '../../app/actions/jobActions';

interface CompanyFeedProps {
    initialCompanies: Company[];
    initialTotalPages: number;
    searchParams: {
        q?: string;
        sort?: string;
        view?: string;
    };
}

function fixJobUrl(url: string): string {
    if (!url) return '#';
    if (url.includes('api.smartrecruiters.com')) {
        const match = url.match(/\/companies\/([^/]+)\/postings\/([^/?#]+)/);
        if (match) return `https://jobs.smartrecruiters.com/${match[1]}/${match[2]}`;
    }
    return url;
}

export default function CompanyFeed({ initialCompanies, initialTotalPages, searchParams }: CompanyFeedProps) {
    const [companies, setCompanies] = useState<Company[]>(initialCompanies);
    const [page, setPage] = useState(1);
    const [isFetchingCompanies, setIsFetchingCompanies] = useState(false);
    const [q, setQ] = useState(searchParams.q || '');
    const [sort, setSort] = useState(searchParams.sort || 'alphabetical');
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
        initialCompanies.length > 0 ? initialCompanies[0].id : null
    );
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [viewState, setViewState] = useState<'details' | 'roles'>('details');
    const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
    const [companyJobsPage, setCompanyJobsPage] = useState(1);
    const [companyJobsTotalPages, setCompanyJobsTotalPages] = useState(0);
    const [isFetchingJobs, setIsFetchingJobs] = useState(false);
    const [seenCompanyIds, setSeenCompanyIds] = useState<number[]>(initialCompanies.map(c => c.id));
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const totalPages = initialTotalPages;
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setIsDescExpanded(false);
        setViewState('details');
        setCompanyJobs([]);
    }, [selectedCompanyId]);

    useEffect(() => {
        setCompanies(initialCompanies);
        setPage(1);
        setSeenCompanyIds(initialCompanies.map(c => c.id));
        if (initialCompanies.length > 0) setSelectedCompanyId(initialCompanies[0].id);
        else setSelectedCompanyId(null);

        // Load favorite IDs on mount
        getFavoriteCompanyIds().then(setFavoriteIds);
    }, [initialCompanies]);

    const selectedCompany = companies.find(c => c.id === selectedCompanyId);

    const doSearch = async (newQ: string, newSort: string) => {
        try {
            const data = await getCompanies({
                q: newQ,
                sort: newSort,
                page: 1,
                favoritesOnly: searchParams.view === 'favorites'
            });
            if (data?.companies) {
                const list = data.companies as Company[];
                setCompanies(list);
                setPage(1);
                setSeenCompanyIds(list.map(c => c.id));
                setSelectedCompanyId(list.length > 0 ? list[0].id : null);
            }
        } catch (e) { console.error(e); }
    };

    const handleSearch = (val: string) => {
        setQ(val);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => doSearch(val, sort), 400);
    };

    const handleSort = (val: string) => {
        setSort(val);
        doSearch(q, val);
    };

    const loadMoreCompanies = async () => {
        setIsFetchingCompanies(true);
        try {
            const nextPage = page + 1;
            const data = await getCompanies({
                q,
                sort,
                page: nextPage,
                excludedCompanyIds: seenCompanyIds,
                favoritesOnly: searchParams.view === 'favorites'
            });
            if (data?.companies) {
                const newOnes = data.companies as Company[];
                setCompanies(prev => [...prev, ...newOnes]);
                setSeenCompanyIds(prev => [...prev, ...newOnes.map(c => c.id)]);
                setPage(nextPage);
            }
        } catch (e) { console.error(e); }
        finally { setIsFetchingCompanies(false); }
    };

    const handleToggleFavorite = async (e: React.MouseEvent, companyId: number) => {
        e.stopPropagation();
        try {
            const { isFavorite } = await toggleFavoriteCompany(companyId);
            if (isFavorite) {
                setFavoriteIds(prev => [...prev, companyId]);
            } else {
                setFavoriteIds(prev => prev.filter(id => id !== companyId));
                // If we are in Favorites view, remove from list
                if (searchParams.view === 'favorites') {
                    setCompanies(prev => prev.filter(c => c.id !== companyId));
                    if (selectedCompanyId === companyId) {
                        setSelectedCompanyId(null);
                    }
                }
            }
        } catch (e) { console.error(e); }
    };

    const handleViewRoles = async () => {
        if (!selectedCompanyId) return;
        setViewState('roles');
        setIsFetchingJobs(true);
        setCompanyJobsPage(1);
        try {
            const data = await getJobs({ company_id: selectedCompanyId, page: 1 });
            if (data?.jobs) {
                setCompanyJobs(data.jobs as Job[]);
                setCompanyJobsTotalPages(data.totalPages || 0);
            }
        } catch (e) { console.error(e); }
        finally { setIsFetchingJobs(false); }
    };

    const loadMoreCompanyJobs = async () => {
        if (!selectedCompanyId) return;
        setIsFetchingJobs(true);
        try {
            const nextPage = companyJobsPage + 1;
            const data = await getJobs({ company_id: selectedCompanyId, page: nextPage });
            if (data?.jobs) {
                setCompanyJobs(prev => [...prev, ...(data.jobs as Job[])]);
                setCompanyJobsPage(nextPage);
                setCompanyJobsTotalPages(data.totalPages || 0);
            }
        } catch (e) { console.error(e); }
        finally { setIsFetchingJobs(false); }
    };

    return (
        <div className="flex h-full overflow-hidden">

            {/* ── Middle: Company List ── */}
            <div className="flex flex-col flex-1 border-r border-[var(--border)] overflow-hidden min-w-0">

                {/* Search + filters */}
                <div className="border-b border-[var(--border)] px-4 py-3 space-y-2 bg-[var(--background)] shrink-0">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={q}
                            onChange={e => handleSearch(e.target.value)}
                            placeholder='Search for a company or industry...'
                            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-700 placeholder-slate-400"
                        />
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                            <span>Company size</span>
                            <select className="border-none bg-transparent text-slate-700 font-medium text-sm focus:outline-none cursor-pointer ml-1">
                                <option>Any</option>
                                <option>Small</option>
                                <option>Medium</option>
                                <option>Large</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>Ordered by</span>
                            <select
                                value={sort}
                                onChange={e => handleSort(e.target.value)}
                                className="border-none bg-transparent text-slate-700 font-medium text-sm focus:outline-none cursor-pointer ml-1"
                            >
                                <option value="alphabetical">Trading name</option>
                                <option value="jobs_desc">Most roles</option>
                                <option value="jobs_asc">Fewest roles</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {companies.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">
                            <Building className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                            <p>No companies found.</p>
                        </div>
                    ) : (
                        <>
                            {companies.map(company => {
                                const isSelected = selectedCompanyId === company.id;
                                return (
                                    <div
                                        key={company.id}
                                        onClick={() => setSelectedCompanyId(company.id)}
                                        className={`group px-4 py-4 border-b border-[var(--border)] cursor-pointer transition-all
                                            border-l-2 ${isSelected
                                                ? 'bg-blue-50/60 border-l-[#137cdb]'
                                                : 'bg-white hover:bg-slate-50/70 border-l-transparent'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Logo tile — larger with letter fallback */}
                                            <div className="w-10 h-10 rounded-lg border border-[var(--border)] bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                                                {company.url_favicon ? (
                                                    <img src={company.url_favicon} alt="" className="w-6 h-6 object-contain" />
                                                ) : (
                                                    <span className="text-sm font-bold text-slate-400">
                                                        {company.trading_name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* Name + role count */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <h3 className="font-bold text-[14px] text-slate-900 leading-tight truncate">{company.trading_name}</h3>
                                                        {company.companies_house_name && (
                                                            <p className="text-[11px] text-slate-400 truncate">{company.companies_house_name}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {/* Favorite star */}
                                                        <button
                                                            onClick={(e) => handleToggleFavorite(e, company.id)}
                                                            className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${favoriteIds.includes(company.id) ? 'text-amber-400' : 'text-slate-300'}`}
                                                        >
                                                            <Star className={`w-4 h-4 ${favoriteIds.includes(company.id) ? 'fill-current' : ''}`} />
                                                        </button>
                                                        {/* Prominent role count pill */}
                                                        {(company.active_jobs_count || 0) > 0 && (
                                                            <span className="shrink-0 text-[11px] font-semibold text-[#137cdb] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                                {company.active_jobs_count} roles
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* 2-line description */}
                                                {company.description && (
                                                    <p className="text-[12px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                                                        {company.description}
                                                    </p>
                                                )}

                                                {/* Badges — flat rectangular style */}
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {company.licensed_sponsor && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-[#137cdb] text-white tracking-wide">
                                                            ✓ Licensed sponsor
                                                        </span>
                                                    )}
                                                    {company.estimated_num_employees_label && (
                                                        <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-sm bg-slate-100 text-slate-500 border border-slate-200">
                                                            {company.estimated_num_employees_label}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Load More */}
                            {page < totalPages && (
                                <div className="flex justify-center py-6">
                                    <button
                                        onClick={loadMoreCompanies}
                                        disabled={isFetchingCompanies}
                                        className="flex items-center gap-2 px-6 py-2 border border-[var(--border)] rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                    >
                                        {isFetchingCompanies ? 'Loading...' : <><ChevronRight className="w-4 h-4" /> Load more companies</>}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ── Right: Detail Panel ── */}
            <div className="hidden lg:flex flex-col w-[360px] shrink-0 overflow-hidden bg-white">
                {!selectedCompany ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                        <Building className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-500 text-sm">Select a company to view details</p>
                    </div>
                ) : viewState === 'details' ? (
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded border border-[var(--border)] bg-white flex items-center justify-center shrink-0 overflow-hidden">
                                {selectedCompany.url_favicon ? (
                                    <img src={selectedCompany.url_favicon} alt="" className="w-6 h-6 object-contain" />
                                ) : (
                                    <span className="text-sm font-bold text-slate-400">{selectedCompany.trading_name.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-slate-900 leading-tight">{selectedCompany.trading_name}</h2>
                                {selectedCompany.companies_house_name && (
                                    <p className="text-xs text-slate-400 uppercase tracking-wide">{selectedCompany.companies_house_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-4 mt-3 mb-1">
                            {selectedCompany.url && (
                                <a href={selectedCompany.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-600 transition-colors">
                                    <Globe className="w-4 h-4" /> Website
                                </a>
                            )}
                            {selectedCompany.url_linkedin && (
                                <a href={selectedCompany.url_linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-600 transition-colors">
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </a>
                            )}
                        </div>

                        <button className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-red-500 mt-1 mb-5 transition-colors">
                            <AlertTriangle className="w-3 h-3" /> Report company no longer exists
                        </button>

                        {/* About */}
                        <div className="border-t border-[var(--border)] pt-5">
                            <h3 className="font-bold text-[15px] text-slate-900 mb-3">About the company</h3>
                            <p className={`text-sm text-slate-600 leading-relaxed ${!isDescExpanded ? 'line-clamp-4' : ''}`}>
                                {selectedCompany.description || `Explore opportunities at ${selectedCompany.trading_name}.`}
                            </p>
                            {(selectedCompany.description || '').length > 220 && (
                                <button
                                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                                    className="text-sm text-slate-700 font-semibold underline mt-1"
                                >
                                    {isDescExpanded ? 'Show less' : 'Show more'}
                                </button>
                            )}
                        </div>

                        {/* View Roles CTA */}
                        <div className="mt-6 pt-5 border-t border-[var(--border)]">
                            <button
                                onClick={handleViewRoles}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-md text-sm font-semibold transition-colors"
                            >
                                View {selectedCompany.active_jobs_count || 0} open roles
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Roles view */
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] shrink-0">
                            <button onClick={() => setViewState('details')} className="p-1 text-slate-500 hover:text-slate-800 rounded">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h3 className="font-bold text-[15px] text-slate-900">Jobs at {selectedCompany.trading_name}</h3>
                                <p className="text-xs text-slate-400">{selectedCompany.active_jobs_count || 0} Roles</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {isFetchingJobs ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : companyJobs.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                                    <p className="text-sm">No roles currently found.</p>
                                </div>
                            ) : (
                                <>
                                    {companyJobs.map(job => (
                                        <a
                                            key={job.id}
                                            href={fixJobUrl(job.url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block bg-slate-50 border border-[var(--border)] p-3.5 rounded-md hover:border-slate-300 transition-colors group"
                                        >
                                            <h4 className="font-semibold text-[14px] text-slate-900 group-hover:text-brand-600 leading-tight mb-1.5 transition-colors">
                                                {job.title}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location || 'UK'}</span>
                                                {job.department && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.department}</span>}
                                            </div>
                                        </a>
                                    ))}
                                    {companyJobsPage < companyJobsTotalPages && (
                                        <button
                                            onClick={loadMoreCompanyJobs}
                                            disabled={isFetchingJobs}
                                            className="w-full py-2 border border-[var(--border)] rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                        >
                                            {isFetchingJobs ? 'Loading...' : 'Load more roles'}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
