import { getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { Models } from "react-native-appwrite/src";

export type GlobalContextType = {
    isLoading: boolean;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    user: Models.Document | Models.DocumentList<Models.Document> | null; // Replace 'DocumentList<Document>' with 'Document'
    setUser: (
        value: Models.Document | Models.DocumentList<Models.Document> | null
    ) => void; // Replace 'DocumentList<Document>' with 'Document'
    // define other properties here
};

const GlobalContext = createContext({});
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] =
        useState<null | Models.DocumentList<Models.Document>>(null); // Replace 'DocumentList<Document>' with 'Document'
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    setIsLoggedIn(true);
                    setUser(res);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Rest of the code remains unchanged
    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
