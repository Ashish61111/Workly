const ICONS = {
    dashboard: (
        <>
            <rect x="3" y="3" width="7" height="7" rx="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </>
    ),

    projects: (
        <>
            <circle cx="10.8" cy="10.8" r="6.8"/>
            <path d="m16 16 4.5 4.5"/>
        </>
    ),

    gigs: (
        <>
            <rect x="3" y="7" width="18" height="14" rx="2"/>
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <path d="M3 12h18"/>
            <path d="M10 12v2h4v-2"/>
        </>
    ),

    proposals: (
        <>
            <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/>
            <path d="M14 3v6h6"/>
            <path d="M8 14h8"/>
            <path d="M8 17h5"/>
        </>
    ),

    services: (
        <>
            <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>
            <path d="M19 2v4"/>
            <path d="M17 4h4"/>
        </>
    ),
};

export default function FreelancerNavIcons({name}) {
    return (
        <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {ICONS[name] || ICONS.dashboard}
        </svg>
    );
}
