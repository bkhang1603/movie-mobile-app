import { Text, SafeAreaView, ScrollView } from "react-native";

const Bookmark = () => {
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView className="px-4 my-6">
                <Text className="text-2xl text-white font-psemibold">
                    Bookmark
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Bookmark;
