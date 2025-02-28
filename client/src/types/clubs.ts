export interface Club {
    id: number;
    name: string;
    description: string;
    members: number;
    events: number;
    advisor: string;
    clubHead: string;
    status: 'active' | 'inactive';
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