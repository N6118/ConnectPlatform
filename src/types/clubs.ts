export interface Club {
    id: number;
    name: string;
    description: string;
    officeBearers: {
        name: string;
        role: string;
        details: string;
    }[];
    department: string;
    members: {
        rollNo: string;
        name: string;
    }[];
    otherDetails: string;
    planOfAction: {
        summary: string;
        budget: number;
    };
    events: {
        name: string;
        description: string;
        date: string;
        outcomes: string;
        awards: string;
        remarks: string;
    }[];
    achievements: {
        id: number;
        title: string;
        description: string;
        date: string;
        clubId: number;
        createdAt: string;
        updatedAt: string;
    }[];
    advisor: string;
    clubHead: string;
}

export interface MembershipData {
    month: string;
    [key: string]: string | number;
}

export interface ClubEventData {
    name: string;
    workshops: number;
    competitions: number;
    socialEvents: number;
}