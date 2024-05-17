import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite/src";

const useAppwrite = (fn: () => Promise<Models.Document[]>) => {
    const [data, setData] = useState<Models.Document[]>([]);
    const [isLoading, setIsLoading] = useState(false); // false

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response = await fn();

            setData(response);
        } catch (error: string | any) {
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData();

    return { data, isLoading, refetch };
};

export default useAppwrite;
