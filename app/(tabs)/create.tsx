import FormField from "@/components/FormField";
import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import icons from "@/constants/icons";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { createVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Create = () => {
    const { user }: any = useGlobalContext();
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        video: null as any,
        thumbnail: null as any,
        prompt: "",
    });

    const openPicker = async (type: "video" | "image") => {
        // const result = await DocumentPicker.getDocumentAsync({
        //     type:
        //         type === "image"
        //             ? ["image/png", "image/jpg", "image/jpeg"]
        //             : ["video/mp4", "video/gif"],
        // });

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:
                type === "image"
                    ? ImagePicker.MediaTypeOptions.Images
                    : ImagePicker.MediaTypeOptions.Videos,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if (type === "image") {
                setForm({ ...form, thumbnail: result.assets[0] });
            }

            if (type === "video") {
                setForm({ ...form, video: result.assets[0] });
            }
        }
    };

    const submit = async () => {
        if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
            return Alert.alert("Please fill all fields");
        }

        setUploading(true);

        try {
            await createVideo({
                ...form,
                userId: user[0].$id,
            });

            Alert.alert("Success", "Video uploaded successfully");
            router.push("/home");
        } catch (error: string | any) {
            Alert.alert("Error", error.message);
        } finally {
            setForm({
                title: "",
                video: null,
                thumbnail: null,
                prompt: "",
            });

            setUploading(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView className="px-4 my-6">
                <Text className="text-2xl text-white font-psemibold">
                    Upload Video
                </Text>

                <FormField
                    title="Video Title"
                    value={form.title}
                    placeholder="Give your video a title"
                    handleChangeText={(e) => setForm({ ...form, title: e })}
                    otherStyles="mt-10"
                />

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Upload Video
                    </Text>

                    <TouchableOpacity onPress={() => openPicker("video")}>
                        {form.video ? (
                            <Video
                                className="w-full h-64 rounded-2xl"
                                source={{ uri: (form.video as any).uri }}
                                resizeMode={ResizeMode.COVER}
                            />
                        ) : (
                            <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                                    <Image
                                        source={icons.upload as any}
                                        resizeMode="contain"
                                        className="w-1/2 h-1/2"
                                    />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Thumbnail Image
                    </Text>

                    <TouchableOpacity onPress={() => openPicker("image")}>
                        {form.thumbnail ? (
                            <Image
                                source={{ uri: (form.thumbnail as any).uri }}
                                resizeMode="cover"
                                className="w-full h-64 rounded-2xl"
                            />
                        ) : (
                            <View
                                className="w-full h-64 px-4 bg-black-100 rounded-2xl 
                                justify-center items-center 
                                border border-black-200 flex-row space-x-2"
                            >
                                <Image
                                    source={icons.upload as any}
                                    resizeMode="contain"
                                    className="w-5 h-5"
                                />

                                <Text className="text-sm text-gray-100 font-pmedium">
                                    Choose a file
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <FormField
                    title="AI Prompt"
                    value={form.prompt}
                    placeholder="The prompt for the AI to generate a video description"
                    handleChangeText={(e) => setForm({ ...form, prompt: e })}
                    otherStyles="mt-7"
                />

                <CustomButton
                    title="Submit & Publish"
                    handlePress={submit}
                    containerStyles="mt-7"
                    isLoading={uploading}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Create;
