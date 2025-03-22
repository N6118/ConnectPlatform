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
    advisor: string;
    clubHead: string;
}

export interface MembershipData {
    month: string;
    [clubName: string]: number | string;
}

export interface ClubEventData {
    name: string;
    workshops: number;
    competitions: number;
    socialEvents: number;
}