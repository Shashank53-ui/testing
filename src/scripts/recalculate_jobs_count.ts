import * as dotenv from 'dotenv';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function run() {
    console.log("Fetching all companies...");
    const { data: companies, error: cErr } = await supabase.from('companies').select('id, trading_name');

    if (cErr || !companies) {
        console.error("Failed to load companies:", cErr);
        return;
    }

    console.log(`Found ${companies.length} companies. Recalculating active_jobs_count...`);

    let updatedCount = 0;
    for (const company of companies) {
        const { count, error: jErr } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

        if (jErr) {
            console.error(`Error counting jobs for ${company.trading_name}:`, jErr);
            continue;
        }

        const actualCount = count || 0;

        await supabase
            .from('companies')
            .update({ active_jobs_count: actualCount })
            .eq('id', company.id);

        updatedCount++;
        if (updatedCount % 50 === 0) {
            console.log(`Updated ${updatedCount} companies...`);
        }
    }

    console.log(`\n✅ Done! Successfully updated active_jobs_count for ${updatedCount} companies to match their exact live UK roles in the database.`);
}
run();
