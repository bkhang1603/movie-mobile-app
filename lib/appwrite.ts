import "react-native-url-polyfill/auto";
import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
} from "react-native-appwrite/src";

type User = {
    username: string;
    email: string;
    password: string;
};

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.kle.aora",
    projectId: "664237b40023632c54c4",
    databaseId: "6642af3d001765d44a64",
    userCollectionId: "6642af5a001fb0ef13e2",
    videoCollectionId: "6642af810014c21c194b",
    storageId: "6642b0de00213bbd1c09",
};

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(endpoint) // Your Appwrite Endpoint
    .setProject(projectId) // Your project ID
    .setPlatform(platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async ({ email, password, username }: User) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error: string | any) {
        throw new Error(error);
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        );

        if (!session) throw Error;

        return session;
    } catch (error: string | any) {
        console.error(error);
        throw new Error(error);
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents;
    } catch (error: string | any) {
        throw new Error(error);
    }
};

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        );

        return posts.documents;
    } catch (error: string | any) {
        throw new Error(error);
    }
};

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        );

        return posts.documents;
    } catch (error: string | any) {
        throw new Error(error);
    }
};
