/**
 * Infers job seniority level from a job title using keyword matching.
 * Priority order matters — check most specific/senior first.
 */
export function inferJobLevel(title: string): string | null {
    if (!title) return null;
    const t = title.toLowerCase();

    // Executive / C-Suite
    if (/\b(chief|cto|ceo|cfo|coo|cpo|president|managing director|md)\b/.test(t)) return 'Executive';

    // Vice President
    if (/\bvp\b|vice president/.test(t)) return 'VP';

    // Director
    if (/\bdirector\b/.test(t)) return 'Director';

    // Principal
    if (/\bprincipal\b/.test(t)) return 'Principal';

    // Lead
    if (/\blead\b/.test(t)) return 'Lead';

    // Senior / Sr
    if (/\b(senior|sr\.?)\b/.test(t)) return 'Senior';

    // Staff
    if (/\bstaff\b/.test(t)) return 'Staff';

    // Internship / Placement
    if (/\b(intern|internship|placement|apprentice|apprenticeship)\b/.test(t)) return 'Internship';

    // Graduate / Entry
    if (/\b(graduate|entry.?level|early career|new grad|associate)\b/.test(t)) return 'Graduate';

    // Junior / Jr
    if (/\b(junior|jr\.?)\b/.test(t)) return 'Junior';

    // Mid-level fallback (anything that doesn't match a specific level)
    return 'Mid-level';
}
