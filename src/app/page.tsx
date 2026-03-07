import { Briefcase, Building, ChevronRight, CheckCircle, Search, Star, ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '../utils/supabase/server';
import Logo from '../components/Logo';
import HomeCarousel from '../components/HomeCarousel';
import PhraseCarousel from '../components/PhraseCarousel';
import * as motion from "framer-motion/client";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const serverSupabase = await createClient();
  const { data: { user } } = await serverSupabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-1"
          >
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="text-brand-600 transition-transform group-hover:scale-110">
                <Logo className="w-9 h-9" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">
                Getlanded
              </span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-500">
            <Link href="/jobs" className="hover:text-slate-900 transition-colors">Jobs</Link>
            <Link href="/companies" className="hover:text-slate-900 transition-colors">Companies</Link>
            <Link href="/applied" className="hover:text-slate-900 transition-colors">Applied</Link>
            {user ? (
              <Link href="/account/profile" className="text-slate-900 px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all font-bold">
                Account
              </Link>
            ) : (
              <Link href="/login" className="bg-slate-900 text-white px-7 py-2.5 rounded-full hover:bg-slate-800 transition-all font-bold">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="min-h-screen pt-20 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
        <div className="w-full max-w-5xl flex flex-col items-center">

          {/* Text Carousel Hero */}
          <div className="w-full mb-4">
            <PhraseCarousel />
          </div>

          {/* Compact Navigation Cards */}
          <div className="w-full max-w-5xl mx-auto mb-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Recommended jobs */}
              <Link
                href="/jobs"
                className="group p-8 bg-white border border-slate-100 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-50/50 transition-all flex flex-col items-start rounded-3xl relative overflow-hidden"
              >
                <div className="w-11 h-11 bg-slate-50 group-hover:bg-brand-50 flex items-center justify-center text-slate-900 group-hover:text-brand-600 mb-6 transition-colors rounded-xl">
                  <Briefcase className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center">
                  Search jobs <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-black text-brand-600" />
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6 text-sm">
                  Explore jobs at companies that can sponsor your visa
                </p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] uppercase tracking-[0.2em]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  20,000+ jobs available
                </div>
              </Link>

              {/* Card 2: Companies */}
              <Link
                href="/companies"
                className="group p-8 bg-white border border-slate-100 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-50/50 transition-all flex flex-col items-start rounded-3xl relative overflow-hidden"
              >
                <div className="w-11 h-11 bg-slate-50 group-hover:bg-brand-50 flex items-center justify-center text-slate-900 group-hover:text-brand-600 mb-6 transition-colors rounded-xl">
                  <Building className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center">
                  Companies that sponsor <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-black text-brand-600" />
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6 text-sm">
                  Search for companies that have the ability to offer visa sponsorship
                </p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] uppercase tracking-[0.2em]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  2,500+ companies identified
                </div>
              </Link>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.02] select-none pointer-events-none overflow-hidden w-full text-center">
            <span className="text-[280px] font-black leading-none whitespace-nowrap tracking-tighter">
              UK SPONSORSHIP
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
