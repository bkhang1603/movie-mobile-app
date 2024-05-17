import { Text, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { useEffect } from "react";
import { searchPosts } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";

const Search = () => {
    const { query } = useLocalSearchParams();
    const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

    useEffect(() => {
        refetch();
    }, [query]);

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts ?? []}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard
                        username={item.creator.username}
                        avatar={item.creator.avatar}
                        thumbnail={item.thumbnail}
                        title={item.title}
                        video={item.video}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="flex my-6 px-4">
                        <Text className="font-pmedium text-sm text-gray-100">
                            Search Results
                        </Text>

                        <Text className="text-2xl font-psemibold text-white">
                            {query}
                        </Text>

                        <View className="mt-6 mb-8">
                            <SearchInput initialQuery={query?.toString()} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No videos found"
                        subtitle="No videos found for the search query. Please try again."
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default Search;
