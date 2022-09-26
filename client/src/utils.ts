import { Record as PbRecord } from "pocketbase";

import { client } from "./api";

export const sleep = (delay: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, delay));

export type User = {
    email: string;
    id: string;
    created: string;
    updated: string;
    verified: boolean;
    profile: {
        "@collectionId": string;
        "@collectionName": string;
        avatar: string;
        created: string;
        id: string;
        name: string;
        unassigned_family_id: string;
        updated: string;
        userId: string;
    }
}

export type Mate = {
    family_id: string;
    id: string;
    name: string;
    user_id: string;
    "@exapnd": Record<string, unknown>
}

export type Family = {
    id: string,
    user_id: string,
    sync_interval_days: number,
    name: string
    "@exapnd": Record<string, unknown>
}

export type Sync = {
    id: string,
    timestamp: Date,
    title: string,
    description: string,
    user_id: string,
    mate_id: string
    "@exapnd": Record<string, unknown>
}

export const getUser = async (): Promise<User> => {
    await client.users.refresh();
    return (client.authStore.model as unknown) as User;
}
