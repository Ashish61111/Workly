const STORAGE_KEY = "workly_demo_conversations";

const INITIAL_CONVERSATIONS = [
    {
        id: 1,
        name: "Olivia Bennett",
        initials: "OB",
        role: "Brand designer",
        project: "Brand identity project",
        time: "10:42 AM",
        unread: 2,
        online: true,
        color: "rose",
        preview: "I've shared the updated concepts with you.",
        messages: [
            {
                id: 1,
                from: "them",
                time: "10:20 AM",
                text: "Hi! I've finished the first round of brand identity concepts.",
            },
            {
                id: 2,
                from: "me",
                time: "10:31 AM",
                text: "Great, I'm looking forward to seeing them.",
            },
            {
                id: 3,
                from: "them",
                time: "10:42 AM",
                text: "I've shared the updated concepts with you.",
            },
        ],
    },
    {
        id: 2,
        name: "Noah Williams",
        initials: "NW",
        role: "Web developer",
        project: "Portfolio website",
        time: "Yesterday",
        unread: 0,
        online: false,
        color: "blue",
        preview: "Thanks for the details. I'll get started today.",
        messages: [
            {
                id: 1,
                from: "them",
                time: "Yesterday",
                text: "Could you send over the page references you mentioned?",
            },
            {
                id: 2,
                from: "me",
                time: "Yesterday",
                text: "Absolutely. I'll send them this afternoon.",
            },
            {
                id: 3,
                from: "them",
                time: "Yesterday",
                text: "Thanks for the details. I'll get started today.",
            },
        ],
    },
    {
        id: 3,
        name: "Mia Chen",
        initials: "MC",
        role: "Video editor",
        project: "Product launch video",
        time: "Mon",
        unread: 0,
        online: true,
        color: "lilac",
        preview: "Would Friday work for the final delivery?",
        messages: [
            {
                id: 1,
                from: "them",
                time: "Monday",
                text: "The first cut is ready for your review.",
            },
            {
                id: 2,
                from: "me",
                time: "Monday",
                text: "The pacing looks good. I'll review the details today.",
            },
            {
                id: 3,
                from: "them",
                time: "Monday",
                text: "Would Friday work for the final delivery?",
            },
        ],
    },
    {
        id: 4,
        name: "Ethan Brooks",
        initials: "EB",
        role: "UX designer",
        project: "Mobile app prototype",
        time: "Oct 24",
        unread: 0,
        online: false,
        color: "sage",
        preview: "I've added the revised onboarding flow.",
        messages: [
            {
                id: 1,
                from: "them",
                time: "Oct 24",
                text: "I've added the revised onboarding flow.",
            },
        ],
    },
];

function cloneInitialConversations() {
    return INITIAL_CONVERSATIONS.map((conversation) => ({
        ...conversation,
        messages: conversation.messages.map((message) => ({...message})),
    }));
}

export function getWorklyConversations() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            const parsed = JSON.parse(stored);

            if (
                Array.isArray(parsed) &&
                parsed.every(
                    (conversation) =>
                        conversation &&
                        conversation.id !== undefined &&
                        Array.isArray(conversation.messages)
                )
            ) {
                return parsed;
            }
        }

        const initial = cloneInitialConversations();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
    } catch (error) {
        console.error("Could not read Workly conversations:", error);
        return cloneInitialConversations();
    }
}

export function saveWorklyConversations(conversations) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
        return true;
    } catch (error) {
        console.error("Could not save Workly conversations:", error);
        return false;
    }
}

export function getWorklyUnreadCount(conversations) {
    return conversations.reduce(
        (total, conversation) => total + Math.max(0, Number(conversation.unread) || 0),
        0
    );
}
