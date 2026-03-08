/**
 * exportLocal.ts
 * 
 * Exports all companies and jobs from Supabase to local JSON files.
 * 
 * Output files:
 *   /Users/shami/Downloads/JOBS/companies.json
 *   /Users/shami/Downloads/JOBS/jobs.json
 * 
 * Run: npx tsx src/scripts/exportLocal.ts
 * Options:
 *   --companies-only   Only export companies
 *   --jobs-only        Only export jobs
 *   --out <dir>        Custom output directory (default: /Users/shami/Downloads/JOBS)
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Parse CLI args
const args = process.argv.slice(2);
const companiesOnly = args.includes('--companies-only');
const jobsOnly = args.includes('--jobs-only');
const outIdx = args.indexOf('--out');
const outDir = outIdx !== -1 ? args[outIdx + 1] : '/Users/shami/Downloads/JOBS';

function writeJSON(filePath: string, data: any[]) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Saved ${data.length.toLocaleString()} records → ${filePath}`);
}

async function fetchAll(table: string, columns = '*') {
    const allRows: any[] = [];
    const PAGE = 1000;
    let from = 0;

    process.stdout.write(`\n📥 Fetching ${table}...`);
    while (true) {
        const { data, error } = await supabase
            .from(table)
            .select(columns)
            .range(from, from + PAGE - 1);

        if (error) {
            console.error(`\nError fetching ${table}:`, error.message);
            break;
        }
        if (!data || data.length === 0) break;

        allRows.push(...data);
        process.stdout.write(` ${allRows.length}`);
        if (data.length < PAGE) break;
        from += PAGE;
    }
    console.log(' done.');
    return allRows;
}

async function main() {
    console.log('════════════════════════════════════════');
    console.log('  SUPABASE → LOCAL JSON EXPORTER');
    console.log(`  Output dir: ${outDir}`);
    console.log('════════════════════════════════════════');

    if (!jobsOnly) {
        const companies = await fetchAll('companies');
        writeJSON(path.join(outDir, 'companies.json'), companies);
    }

    if (!companiesOnly) {
        const jobs = await fetchAll('jobs', 'id,company_id,title,location,url,department,level,salary,created_at');
        writeJSON(path.join(outDir, 'jobs.json'), jobs);
    }

    console.log('\n✅ Export complete!');
}

main().catch(console.error);
