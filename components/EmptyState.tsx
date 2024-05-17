import { View, Image, Text } from "react-native";

import images from "@/constants/images";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

type EmptyStateProps = {
    title: string;
    subtitle: string;
};

const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
    return (
        <View className="justify-center items-center px-4">
            <Image
                source={images.empty}
                className="w-[270px] h-[215px]"
                resizeMode="contain"
            />

            <Text className="text-xl text-center font-psemibold text-white">
                {title}
            </Text>

            <Text className="font-pmedium text-sm text-gray-100 mt-2">
                {subtitle}
            </Text>

            <CustomButton
                title="Create a video"
                handlePress={() => router.push("/create-video")}
                containerStyles="w-full mt-7"
            />
        </View>
    );
};

export default EmptyState;
