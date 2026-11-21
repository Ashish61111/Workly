import {useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {
    formatWorklyMoney,
    FreelancerSidebarStarAnimation,
} from "./FreelancerPages";
import WorklyWordMark from "../components/WorklyWordMark";
import "./FreelancerGigsPages.css";

const GIGS_KEY = "workly_demo_gigs";
const MAX_STORAGE_GIGS = 5;
const MAX_SAMPLE_BYTES = 600 * 1024;

const CATEGORIES = [
    "Logo Design",
    "Web Development",
    "UI/UX Design",
    "Video Editing",
    "Content Writing",
    "Branding",
    "Social Media",
    "Voice Over",
    "Other",
];

const PACKAGE_DEFINITIONS = [
    {
        id: "basic",
        label: "Basic",
        defaultDescription: "A simple package covering the core service.",
        defaultFeatures: ["Core deliverable", "Standard communication"],
    },
    {
        id: "standard",
        label: "Standard",
        defaultDescription: "A complete package with additional deliverables.",
        defaultFeatures: [
            "Core deliverable",
            "Additional deliverables",
            "Priority communication",
        ],
    },
    {
        id: "premium",
        label: "Premium",
        defaultDescription: "The complete service with an expanded scope.",
        defaultFeatures: [
            "Complete deliverables",
            "Source files where applicable",
            "Priority support",
            "Additional revisions",
        ],
    },
];

const NAV_ITEMS = [
    {label: "Dashboard", mobileLabel: "Home", to: "/freelancer/dashboard", icon: "dashboard"},
    {label: "Find projects", mobileLabel: "Projects", to: "/freelancer/projects", icon: "projects"},
    {label: "My gigs", mobileLabel: "Gigs", to: "/freelancer/my-gigs", icon: "gigs"},
    {label: "My proposals", mobileLabel: "Proposals", to: "/freelancer/proposals", icon: "proposals"},
    {label: "Client services", mobileLabel: "Services", to: "/explore-services", icon: "services"},
];

/* =====================================================
   GIG DATA HELPERS
   ===================================================== */

function getGigAccountConfig() {
    try {
        const isTopRated =
            localStorage.getItem("workly_demo_freelancer_tier") === "top-rated";

        return {isTopRated, maxGigs: isTopRated ? 5 : 3};
    } catch {
        return {isTopRated: false, maxGigs: 3};
    }
}

function makeDefaultPackages(gig = {}) {
    const minPrice = Math.max(1, Number(gig.minPrice) || 2500);
    const maxPrice = Math.max(minPrice, Number(gig.maxPrice) || minPrice * 2);
    const standardPrice = Math.round((minPrice + maxPrice) / 2);
    const normalDays = Math.max(1, Number(gig.deliveryDays) || 7);

    const defaults = [
        {price: minPrice, deliveryDays: normalDays, revisions: 1},
        {
            price: Math.max(minPrice, standardPrice),
            deliveryDays: Math.max(1, normalDays - 2),
            revisions: 2,
        },
        {
            price: Math.max(minPrice, maxPrice),
            deliveryDays: Math.max(1, normalDays - 4),
            revisions: 3,
        },
    ];

    return PACKAGE_DEFINITIONS.map((definition, index) => ({
        ...definition,
        ...defaults[index],
        description: definition.defaultDescription,
        features: [...definition.defaultFeatures],
    }));
}

function normalizeGig(gig = {}) {
    const fallbackPackages = makeDefaultPackages(gig);
    const savedPackages = Array.isArray(gig.packages) ? gig.packages : [];

    const packages = PACKAGE_DEFINITIONS.map((definition) => {
        const fallback = fallbackPackages.find((item) => item.id === definition.id);
        const saved = savedPackages.find((item) => item?.id === definition.id);

        return {
            ...fallback,
            ...(saved || {}),
            id: definition.id,
            label: definition.label,
            features: Array.isArray(saved?.features)
                ? saved.features
                : fallback.features,
        };
    });

    return {...gig, packages};
}

function readGigs() {
    try {
        const parsed = JSON.parse(localStorage.getItem(GIGS_KEY) || "[]");

        return Array.isArray(parsed)
            ? parsed.slice(0, MAX_STORAGE_GIGS).map(normalizeGig)
            : [];
    } catch {
        return [];
    }
}

function saveGigs(gigs) {
    try {
        localStorage.setItem(
            GIGS_KEY,
            JSON.stringify(gigs.slice(0, MAX_STORAGE_GIGS))
        );
    } catch {
        throw new Error(
            "Your gig could not be saved. Browser storage may be full; try a smaller sample file."
        );
    }
}

function emptyForm() {
    const packages = makeDefaultPackages().map((item) => ({
        ...item,
        featuresText: item.features.join("\n"),
    }));

    return {
        title: "",
        category: CATEGORIES[0],
        description: "",
        packages,
        expressAvailable: false,
        expressDays: "2",
        expressFee: "1000",
        sampleName: "",
        sampleType: "",
        sampleData: "",
    };
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("The sample file could not be read."));
            }
        };

        reader.onerror = () => reject(new Error("The sample file could not be read."));
        reader.readAsDataURL(file);
    });
}

/* =====================================================
   NAVIGATION ICONS
   ===================================================== */

function NavIcon({name}) {
    const common = {
        viewBox: "0 0 24 24",
        width: 19,
        height: 19,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };

    if (name === "dashboard") {
        return (
            <svg {...common}>
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
        );
    }

    if (name === "projects") {
        return (
            <svg {...common}>
                <circle cx="10.8" cy="10.8" r="6.8"/>
                <path d="m16 16 4.5 4.5"/>
                <path d="M8 10.8h5.6M10.8 8v5.6"/>
            </svg>
        );
    }

    if (name === "gigs") {
        return (
            <svg {...common}>
                <rect x="3" y="7" width="18" height="14" rx="2"/>
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/>
            </svg>
        );
    }

    if (name === "proposals") {
        return (
            <svg {...common}>
                <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/>
                <path d="M14 3v5h5M9 12h6M9 16h6"/>
            </svg>
        );
    }

    return (
        <svg {...common}>
            <path d="m12 2 2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2Z"/>
            <path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"/>
        </svg>
    );
}

/* =====================================================
   FREELANCER NAVIGATION
   ===================================================== */

function GigNavigation({mobile = false}) {
    return (
        <nav
            className={mobile ? "fw-mobile-nav" : "fw-sidebar-nav"}
            aria-label={mobile ? "Mobile freelancer navigation" : "Freelancer navigation"}
        >
            {NAV_ITEMS.map((item) => (
                <Link
                    key={item.label}
                    to={item.to}
                    className={`fw-nav-link ${item.label === "My gigs" ? "is-active" : ""}`}
                    aria-current={item.label === "My gigs" ? "page" : undefined}
                >
                    <span className="fw-nav-icon">
                        <NavIcon name={item.icon}/>
                    </span>
                    <span className="fw-nav-label">{item.label}</span>
                    <span className="fw-nav-mobile-label">{item.mobileLabel}</span>
                </Link>
            ))}
        </nav>
    );
}

/* =====================================================
   GIG WORKSPACE LAYOUT
   ===================================================== */

function GigWorkspaceLayout({title, eyebrow, subtitle, children}) {
    return (
        <main className="fw-page">
            <header className="fw-topbar">
                <Link className="fw-brand-link" to="/home" aria-label="Workly home">
                    <WorklyWordMark prefix="" className="fw-wordmark"/>
                </Link>

                <div className="fw-topbar-right">
                    <span className="fw-role-pill">Freelancer workspace</span>
                </div>
            </header>

            {/* Use the same scroll-synchronized golden star animation as FreelancerPages.jsx */}
            <FreelancerSidebarStarAnimation/>

            <div className="fw-layout">
                <aside className="fw-sidebar">
                    <div className="fw-sidebar-label">WORKSPACE</div>

                    <GigNavigation/>

                    <div className="fw-sidebar-note">
                        <span className="fw-note-star" aria-hidden="true">✦</span>
                        <strong>Show the value behind your skills.</strong>
                        <p>Thoughtful examples help clients understand what you can deliver.</p>
                    </div>

                    <div className="fg-policy" role="note">
                        <span aria-hidden="true">⛨</span>
                        <div>
                            <strong>Workly-only payments</strong>
                            <p>Project payments and optional tips must stay on Workly.</p>
                        </div>
                    </div>
                </aside>

                <section className="fw-main">
                    <div className="fw-page-heading">
                        <div>
                            <p className="fw-eyebrow">{eyebrow}</p>
                            <h1>{title}</h1>
                            {subtitle && <p className="fw-subtitle">{subtitle}</p>}
                        </div>

                        <Link className="fw-primary-button" to="/freelancer/showcase/demo-freelancer">
                            Preview public profile ↗
                        </Link>
                    </div>

                    {children}

                    <p className="fw-demo-notice">
                        Preview mode · Gig listings and sample uploads stay in this browser.
                        Backend upload, client messaging and payment processing are not connected yet.
                    </p>
                </section>
            </div>

            <GigNavigation mobile/>
        </main>
    );
}

/* =====================================================
   PAYMENT POLICY
   ===================================================== */

function PaymentRules() {
    return (
        <div className="fg-policy" role="note">
            <span aria-hidden="true">⛨</span>
            <div>
                <strong>Workly-only payments policy</strong>
                <p>
                    All project payments and optional tips must be processed through Workly.
                    Clients or freelancers who arrange or complete payments outside Workly
                    may lose access to the platform.
                </p>
            </div>
        </div>
    );
}

/* =====================================================
   PACKAGE EDITOR
   ===================================================== */

function PackageEditor({packageData, onChange}) {
    return (
        <section className={`fg-package-editor-card fg-package-${packageData.id}`}>
            <div className="fg-editor-header">
                <div>
                    <span className="fg-package-label">{packageData.label}</span>
                    {packageData.id === "premium" && (
                        <span className="fg-package-recommended"> PREMIUM OFFERING</span>
                    )}
                </div>
            </div>

            <div className="fg-form-grid fg-inner-grid">
                <label className="fg-field">
                    Package price (₹)
                    <input
                        type="number"
                        min="1"
                        required
                        value={packageData.price}
                        onChange={(event) => onChange("price", event.target.value)}
                    />
                </label>

                <label className="fg-field">
                    Delivery time
                    <select
                        value={packageData.deliveryDays}
                        onChange={(event) => onChange("deliveryDays", Number(event.target.value))}
                    >
                        {[1, 2, 3, 5, 7, 10, 14, 21, 30].map((days) => (
                            <option value={days} key={days}>
                                {days} day{days === 1 ? "" : "s"}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="fg-field">
                    Number of revisions
                    <input
                        type="number"
                        min="0"
                        max="99"
                        required
                        value={packageData.revisions}
                        onChange={(event) => onChange("revisions", event.target.value)}
                    />
                </label>

                <label className="fg-field fg-span-two">
                    Package description
                    <textarea
                        rows={3}
                        required
                        maxLength={300}
                        value={packageData.description}
                        onChange={(event) => onChange("description", event.target.value)}
                        placeholder="Explain what this package includes."
                    />
                    <small>{packageData.description.length}/300 characters</small>
                </label>

                <label className="fg-field fg-span-two">
                    What's included?
                    <textarea
                        rows={4}
                        value={packageData.featuresText}
                        onChange={(event) => onChange("featuresText", event.target.value)}
                        placeholder={"One feature per line\nExample:\nLogo concept\nSource file"}
                    />
                    <small>Enter one inclusion per line.</small>
                </label>
            </div>
        </section>
    );
}

/* =====================================================
   GIG CREATION AND EDITING
   ===================================================== */

function GigEditor({initialGig, onSave, onCancel, slot, maxGigs}) {
    const [form, setForm] = useState(() => {
        const base = emptyForm();
        if (!initialGig) return base;

        const normalized = normalizeGig(initialGig);

        return {
            ...base,
            ...normalized,
            packages: normalized.packages.map((item) => ({
                ...item,
                featuresText: (item.features || []).join("\n"),
            })),
        };
    });

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    function setField(name, value) {
        setForm((current) => ({...current, [name]: value}));
    }

    function updatePackage(packageId, field, value) {
        setForm((current) => ({
            ...current,
            packages: current.packages.map((item) =>
                item.id === packageId ? {...item, [field]: value} : item
            ),
        }));
    }

    async function handleFile(event) {
        setError("");

        const file = event.target.files?.[0];
        if (!file) return;

        const supported =
            file.type.startsWith("image/") ||
            file.type === "application/pdf";

        if (!supported) {
            setError("Upload an image or PDF sample.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_SAMPLE_BYTES) {
            setError("Each sample must be under 600 KB in this preview.");
            event.target.value = "";
            return;
        }

        try {
            const data = await readFileAsDataURL(file);

            setForm((current) => ({
                ...current,
                sampleName: file.name,
                sampleType: file.type,
                sampleData: data,
            }));
        } catch (fileError) {
            setError(fileError.message || "Could not load this sample.");
        } finally {
            event.target.value = "";
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!form.title.trim()) {
            setError("Add a title for your gig.");
            return;
        }

        if (form.description.trim().length < 30) {
            setError("Your service description must contain at least 30 characters.");
            return;
        }

        const packages = form.packages.map((item) => ({
            id: item.id,
            label: item.label,
            price: Number(item.price),
            description: item.description.trim(),
            deliveryDays: Number(item.deliveryDays),
            revisions: Number(item.revisions),
            features: item.featuresText
                .split("\n")
                .map((feature) => feature.trim())
                .filter(Boolean),
        }));

        const invalidPackage = packages.some((item) =>
            !Number.isFinite(item.price) || item.price <= 0 ||
            !Number.isInteger(item.deliveryDays) || item.deliveryDays <= 0 ||
            !Number.isInteger(item.revisions) || item.revisions < 0 ||
            !item.description
        );

        if (invalidPackage) {
            setError("Every package needs a valid price, delivery time, revision count and description.");
            return;
        }

        const [basic, standard, premium] = packages;

        if (basic.price > standard.price || standard.price > premium.price) {
            setError("Package prices must follow Basic ≤ Standard ≤ Premium.");
            return;
        }

        if (
            form.expressAvailable &&
            (
                !Number(form.expressDays) ||
                Number(form.expressDays) >= Math.min(...packages.map((item) => item.deliveryDays))
            )
        ) {
            setError("Express delivery must be faster than the fastest package delivery time.");
            return;
        }

        const gig = {
            ...form,
            id: initialGig?.id || `gig-${Date.now()}`,
            title: form.title.trim(),
            description: form.description.trim(),
            packages,
            minPrice: basic.price,
            maxPrice: premium.price,
            deliveryDays: basic.deliveryDays,
            expressDays: form.expressAvailable ? Number(form.expressDays) : null,
            expressFee: form.expressAvailable
                ? Math.max(0, Number(form.expressFee) || 0)
                : 0,
            updatedAt: new Date().toISOString(),
        };

        setSaving(true);

        try {
            onSave(gig);
        } catch (saveError) {
            setError(saveError.message || "Your gig could not be saved. Try a smaller sample file.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="fg-editor" onSubmit={handleSubmit}>
            <div className="fg-editor-header">
                <div>
                    <p className="fw-eyebrow">GIG {slot} OF {maxGigs}</p>
                    <h2>{initialGig ? "Edit your gig" : "Create a gig"}</h2>
                    <p>Create three clear packages so clients can choose the service that suits them.</p>
                </div>

                <button
                    type="button"
                    className="fg-icon-button"
                    onClick={onCancel}
                    aria-label="Close editor"
                >
                    ×
                </button>
            </div>

            <div className="fg-form-grid">
                <label className="fg-field fg-span-two">
                    Gig title
                    <input
                        required
                        maxLength={90}
                        value={form.title}
                        onChange={(event) => setField("title", event.target.value)}
                        placeholder="e.g. I will design a premium brand identity"
                    />
                </label>

                <label className="fg-field">
                    Category
                    <select
                        value={form.category}
                        onChange={(event) => setField("category", event.target.value)}
                    >
                        {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="fg-field fg-span-two">
                    Service description
                    <textarea
                        required
                        minLength={30}
                        maxLength={1500}
                        rows={5}
                        value={form.description}
                        onChange={(event) => setField("description", event.target.value)}
                        placeholder="Explain your overall service, skills, deliverables, client requirements and limitations."
                    />
                    <small>{form.description.length}/1500 characters</small>
                </label>
            </div>

            <div className="fg-package-section">
                <div className="fg-gigs-header">
                    <div>
                        <p className="fw-eyebrow">CUSTOM SERVICE PRICING</p>
                        <h2>Basic, Standard and Premium</h2>
                        <p>Set separate prices, delivery deadlines, revisions and inclusions for each tier.</p>
                    </div>
                </div>

                <div className="fg-form-grid">
                    {form.packages.map((packageData) => (
                        <PackageEditor
                            key={packageData.id}
                            packageData={packageData}
                            onChange={(field, value) =>
                                updatePackage(packageData.id, field, value)
                            }
                        />
                    ))}
                </div>
            </div>

            <div className="fg-express-panel">
                <label className="fg-switch-line">
                    <input
                        type="checkbox"
                        checked={form.expressAvailable}
                        onChange={(event) =>
                            setField("expressAvailable", event.target.checked)
                        }
                    />

                    <span>
                        <strong>Offer additional express delivery</strong>
                        <small>Allow clients to pay an extra fee for a faster deadline.</small>
                    </span>
                </label>

                {form.expressAvailable && (
                    <div className="fg-form-grid fg-inner-grid">
                        <label className="fg-field">
                            Express delivery time
                            <select
                                value={form.expressDays}
                                onChange={(event) =>
                                    setField("expressDays", event.target.value)
                                }
                            >
                                {[1, 2, 3, 4, 5].map((days) => (
                                    <option key={days} value={days}>
                                        {days} day{days === 1 ? "" : "s"}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="fg-field">
                            Extra express fee (₹)
                            <input
                                type="number"
                                min="0"
                                value={form.expressFee}
                                onChange={(event) =>
                                    setField("expressFee", event.target.value)
                                }
                            />
                        </label>
                    </div>
                )}
            </div>

            <div className="fg-upload-block">
                <div>
                    <strong>Sample work</strong>
                    <p>Upload one image or PDF to showcase this gig. Maximum file size: 600 KB.</p>
                </div>

                <label className="fg-upload-drop">
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFile}
                    />
                    <span className="fg-upload-icon">↑</span>
                    <strong>{form.sampleName || "Choose a sample file"}</strong>
                    <small>Image or PDF · up to 600 KB</small>
                </label>

                {form.sampleData && (
                    <div className="fg-upload-preview">
                        {form.sampleType.startsWith("image/") ? (
                            <img
                                src={form.sampleData}
                                alt="Uploaded work sample preview"
                            />
                        ) : (
                            <div className="fg-pdf-thumb">PDF</div>
                        )}

                        <div>
                            <strong>{form.sampleName}</strong>
                            <small>Sample attached to this gig</small>
                        </div>

                        <button
                            type="button"
                            className="fg-remove-sample"
                            onClick={() =>
                                setForm((current) => ({
                                    ...current,
                                    sampleName: "",
                                    sampleType: "",
                                    sampleData: "",
                                }))
                            }
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>

            {error && <p className="fg-error" role="alert">{error}</p>}

            <div className="fg-editor-footer">
                <p>All package prices, project payments and optional tips must remain on Workly.</p>
                <div>
                    <button
                        type="button"
                        className="fw-outline-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="fw-primary-button"
                    >
                        {saving ? "Saving..." : initialGig ? "Save changes" : "Publish gig"}
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>
        </form>
    );
}

/* =====================================================
   MY GIGS PAGE
   ===================================================== */

export function FreelancerGigsPage() {
    const account = getGigAccountConfig();
    const maxGigs = account.maxGigs;

    const [gigs, setGigs] = useState(() => readGigs());
    const [editing, setEditing] = useState(null);
    const [notice, setNotice] = useState("");

    function handleSave(gig) {
        const exists = gigs.some((item) => item.id === gig.id);

        const nextGigs = exists
            ? gigs.map((item) => item.id === gig.id ? gig : item)
            : [...gigs, gig];

        if (nextGigs.length > maxGigs) {
            throw new Error(`Your current limit is ${maxGigs} gigs.`);
        }

        saveGigs(nextGigs);
        setGigs(nextGigs);
        setEditing(null);

        setNotice(
            exists
                ? "Your gig and packages have been updated."
                : "Your gig and three packages have been saved."
        );
    }

    function handleDelete(gigId) {
        if (!window.confirm("Delete this gig, its packages and its saved sample?")) {
            return;
        }

        const nextGigs = gigs.filter((gig) => gig.id !== gigId);

        try {
            saveGigs(nextGigs);
            setGigs(nextGigs);
            setNotice("Gig deleted. You can now publish a replacement gig.");
        } catch (error) {
            setNotice(error.message || "The gig could not be deleted.");
        }
    }

    const editingGig = gigs.find((gig) => gig.id === editing) || null;

    return (
        <GigWorkspaceLayout
            eyebrow="YOUR SERVICE PORTFOLIO"
            title="Show clients what you do best."
            subtitle="Create focused gigs, customise three service packages, and showcase your work."
        >
            <div className="fg-capacity-row">
                <div>
                    <span className="fg-capacity-icon">✦</span>
                    <div>
                        <strong>{gigs.length} of {maxGigs} gigs created</strong>
                        <p>
                            {account.isTopRated
                                ? "Top-rated account · Five gig slots."
                                : "New freelancer account · Three gig slots."}
                        </p>
                    </div>
                </div>

                <div
                    className="fg-capacity-bars"
                    aria-label={`${gigs.length} of ${maxGigs} gigs used`}
                >
                    {Array.from({length: maxGigs}, (_, index) => (
                        <span
                            key={index}
                            className={index < gigs.length ? "is-filled" : ""}
                        />
                    ))}
                </div>
            </div>

            <PaymentRules/>

            {notice && <p className="fg-notice" role="status">{notice}</p>}

            {editing !== null ? (
                <GigEditor
                    key={editing}
                    initialGig={editingGig}
                    slot={
                        editingGig
                            ? gigs.findIndex((item) => item.id === editingGig.id) + 1
                            : gigs.length + 1
                    }
                    maxGigs={maxGigs}
                    onSave={handleSave}
                    onCancel={() => setEditing(null)}
                />
            ) : (
                <>
                    <div className="fg-gigs-header">
                        <div>
                            <p className="fw-eyebrow">YOUR OFFERINGS</p>
                            <h2>My gigs</h2>
                            <p>Edit packages or remove a gig and publish a replacement.</p>
                        </div>

                        <button
                            type="button"
                            disabled={gigs.length >= maxGigs}
                            className="fw-primary-button"
                            onClick={() => setEditing("new")}
                        >
                            ＋ Create a gig
                        </button>
                    </div>

                    {gigs.length === 0 ? (
                        <div className="fg-empty">
                            <span className="fg-empty-art">✦</span>
                            <h3>Your first gig starts here</h3>
                            <p>
                                Create Basic, Standard and Premium packages with your own prices,
                                delivery times and inclusions.
                            </p>
                            <button
                                type="button"
                                className="fw-primary-button"
                                onClick={() => setEditing("new")}
                            >
                                Create your first gig →
                            </button>
                        </div>
                    ) : (
                        <div className="fg-gig-list">
                            {gigs.slice(0, maxGigs).map((gig, index) => {
                                const normalized = normalizeGig(gig);

                                return (
                                    <article className="fg-gig-card" key={gig.id}>
                                        <div className="fg-gig-art">
                                            {gig.sampleData && gig.sampleType?.startsWith("image/") ? (
                                                <img
                                                    src={gig.sampleData}
                                                    alt={`Sample of ${gig.title}`}
                                                />
                                            ) : gig.sampleData ? (
                                                <div className="fg-pdf-thumb">PDF</div>
                                            ) : (
                                                <span>✦<small>ADD A SAMPLE</small></span>
                                            )}
                                        </div>

                                        <div className="fg-gig-body">
                                            <div className="fg-gig-card-top">
                                                <span className="fw-category-tag">{gig.category}</span>
                                                <span className="fg-gig-number">
                                                    GIG {index + 1} / {maxGigs}
                                                </span>
                                            </div>

                                            <h3>{gig.title}</h3>
                                            <p className="fg-gig-description">{gig.description}</p>

                                            <div className="fg-gig-meta">
                                                <span>
                                                    <small>BASIC</small>
                                                    <strong>
                                                        {formatWorklyMoney(normalized.packages[0].price)}
                                                    </strong>
                                                </span>

                                                <span>
                                                    <small>STANDARD</small>
                                                    <strong>
                                                        {formatWorklyMoney(normalized.packages[1].price)}
                                                    </strong>
                                                </span>

                                                <span>
                                                    <small>PREMIUM</small>
                                                    <strong>
                                                        {formatWorklyMoney(normalized.packages[2].price)}
                                                    </strong>
                                                </span>
                                            </div>

                                            <div className="fg-gig-actions">
                                                <Link
                                                    className="fw-outline-button"
                                                    to="/freelancer/showcase/demo-freelancer"
                                                >
                                                    Public preview ↗
                                                </Link>

                                                <button
                                                    type="button"
                                                    className="fg-quiet-button"
                                                    onClick={() => setEditing(gig.id)}
                                                >
                                                    Edit packages
                                                </button>

                                                <button
                                                    type="button"
                                                    className="fg-delete-button"
                                                    onClick={() => handleDelete(gig.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {gigs.length >= maxGigs && (
                        <p className="fg-limit-note">
                            You've reached your current {maxGigs}-gig limit.
                            Edit an existing gig or delete one before adding another.
                        </p>
                    )}
                </>
            )}

            <section className="fg-commission-card">
                <div className="fg-commission-icon">₹</div>
                <div>
                    <p className="fw-eyebrow">TRANSPARENT EARNINGS</p>
                    <h3>Workly commission depends on your applicable plan.</h3>
                    <p>
                        Workly must disclose the applicable commission, taxes and fees,
                        and expected payout before a client places an order.
                        Commission rates are configured by Workly.
                    </p>
                </div>

                <Link to="/freelancer/dashboard" className="fw-text-link">
                    Back to dashboard →
                </Link>
            </section>

            <div className="fg-tip-card">
                <span>✧</span>
                <div>
                    <strong>Tips are optional and stay on Workly.</strong>
                    <p>Clients may choose to tip after delivery through the Workly order flow.</p>
                </div>
            </div>
        </GigWorkspaceLayout>
    );
}

/* =====================================================
   PUBLIC FREELANCER SHOWCASE
   ===================================================== */

export function FreelancerShowcasePage() {
    const navigate = useNavigate();
    const {freelancerId} = useParams();
    const [gigs] = useState(() => readGigs());
    const account = getGigAccountConfig();

    const freelancerName = freelancerId === "demo-freelancer"
        ? "Your freelancer profile"
        : "Freelancer profile";

    function contactAboutPackage(gig, packageData) {
        const query = new URLSearchParams({
            contact: freelancerId || "freelancer",
            gig: gig.id,
            package: packageData.id,
            price: String(packageData.price),
        });

        navigate(`/inbox?${query.toString()}`);
    }

    return (
        <main className="fg-public-page">
            <header className="fg-public-header">
                <Link className="fw-brand-link" to="/home" aria-label="Workly home">
                    <WorklyWordMark prefix="" className="fw-wordmark"/>
                </Link>

                <div>
                    <Link className="fw-outline-button" to="/freelancer/my-gigs">
                        Manage gigs
                    </Link>
                    <Link className="fw-primary-button" to="/inbox">
                        Inbox ↗
                    </Link>
                </div>
            </header>

            <section className="fg-public-hero">
                <div className="fg-public-monogram">✦</div>
                <div>
                    <p className="fw-eyebrow">WORKLY FREELANCER SHOWCASE</p>
                    <h1>{freelancerName}</h1>
                    <p>
                        Explore services, compare Basic, Standard and Premium packages,
                        and contact this freelancer through Workly.
                    </p>

                    <div className="fg-public-badges">
                        <span>✓ Workly payments only</span>
                        <span>✦ Optional tips after delivery</span>
                        <span>▧ Up to {account.maxGigs} gigs</span>
                    </div>
                </div>
            </section>

            <section className="fg-public-content">
                <div className="fg-gigs-header">
                    <div>
                        <p className="fw-eyebrow">AVAILABLE SERVICES</p>
                        <h2>Services &amp; packages</h2>
                        <p>
                            Compare the packages set by the freelancer.
                            Choose a tier to start a conversation.
                        </p>
                    </div>

                    <span className="fg-public-count">
                        {gigs.length} / {account.maxGigs} gigs
                    </span>
                </div>

                {gigs.length ? (
                    <div className="fg-public-gig-grid">
                        {gigs.slice(0, account.maxGigs).map((gig) => {
                            const normalized = normalizeGig(gig);

                            return (
                                <article className="fg-public-gig-card" key={gig.id}>
                                    <div className="fg-public-gig-art">
                                        {gig.sampleData && gig.sampleType?.startsWith("image/") ? (
                                            <img
                                                src={gig.sampleData}
                                                alt={`Portfolio sample for ${gig.title}`}
                                            />
                                        ) : gig.sampleData ? (
                                            <div className="fg-pdf-thumb">PDF SAMPLE</div>
                                        ) : (
                                            <div className="fg-public-gig-empty">
                                                ✦<small>PORTFOLIO SAMPLE</small>
                                            </div>
                                        )}
                                    </div>

                                    <div className="fg-public-gig-copy">
                                        <span className="fw-category-tag">{gig.category}</span>
                                        <h3>{gig.title}</h3>
                                        <p>{gig.description}</p>

                                        <div className="fg-public-package-grid">
                                            {normalized.packages.map((packageData) => (
                                                <section
                                                    className={`fg-public-package-card fg-public-package-${packageData.id}`}
                                                    key={packageData.id}
                                                >
                                                    <div className="fg-public-package-heading">
                                                        <strong>{packageData.label}</strong>
                                                        {packageData.id === "premium" && (
                                                            <span>COMPLETE</span>
                                                        )}
                                                    </div>

                                                    <div className="fg-public-price">
                                                        {formatWorklyMoney(packageData.price)}
                                                    </div>

                                                    <p>{packageData.description}</p>

                                                    <div className="fg-public-delivery">
                                                        {packageData.deliveryDays} day delivery
                                                        · {packageData.revisions} revisions
                                                    </div>

                                                    <ul>
                                                        {packageData.features.map((feature, index) => (
                                                            <li key={`${packageData.id}-${index}`}>
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    <button
                                                        type="button"
                                                        className={
                                                            packageData.id === "premium"
                                                                ? "fw-primary-button"
                                                                : "fw-outline-button"
                                                        }
                                                        onClick={() =>
                                                            contactAboutPackage(gig, packageData)
                                                        }
                                                    >
                                                        Discuss {packageData.label}
                                                    </button>
                                                </section>
                                            ))}
                                        </div>

                                        {gig.expressAvailable && (
                                            <div className="fg-public-delivery">
                                                Express delivery: {gig.expressDays} days · additional
                                                fee {formatWorklyMoney(gig.expressFee)}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="fg-empty">
                        <span className="fg-empty-art">✦</span>
                        <h3>No gigs published yet</h3>
                        <p>
                            This profile will show its service listings after the freelancer creates them.
                        </p>
                        <Link className="fw-primary-button" to="/freelancer/my-gigs">
                            Create my gigs →
                        </Link>
                    </div>
                )}

                <PaymentRules/>
            </section>

            <footer className="fg-public-footer">
                Workly · Keep project details, conversations, payments and optional tips on the platform.
            </footer>
        </main>
    );
}
