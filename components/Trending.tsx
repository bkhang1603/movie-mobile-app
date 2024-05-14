import { useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Models } from "react-native-appwrite/src";

import icons from "@/constants/icons";
import { ResizeMode, Video } from "expo-av";

type TrendingProps = {
    posts: Models.Document[] | [];
};

type TrendingItemProps = {
    item: Models.Document;
    activeItem: Models.Document | string;
};

const zoomIn: Animatable.CustomAnimation = {
    0: {
        scaleX: 0.9,
        scaleY: 0.9,
    },
    1: {
        scaleX: 1.1,
        scaleY: 1.1,
    },
};

const zoomOut: Animatable.CustomAnimation = {
    0: {
        scaleX: 1.1,
        scaleY: 1.1,
    },
    1: {
        scaleX: 0.9,
        scaleY: 0.9,
    },
};

const TrendingItem = ({ item, activeItem }: TrendingItemProps) => {
    const [play, setPlay] = useState(false);

    return (
        <Animatable.View
            className="mr-5"
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}
        >
            {play ? (
                <Video
                    source={{ uri: item.video }}
                    className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                        if ("didJustFinish" in status && status.didJustFinish) {
                            setPlay(false);
                        }
                    }}
                />
            ) : (
                <TouchableOpacity
                    className="relative justify-center items-center"
                    onPress={() => setPlay(true)}
                    activeOpacity={0.7}
                >
                    <ImageBackground
                        source={{ uri: item.thumbnail }}
                        className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
                        resizeMode="cover"
                    />

                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </Animatable.View>
    );
};

const Trending = ({ posts }: TrendingProps) => {
    const [activeItem, setActiveItem] = useState(posts[0]);

    const viewableItemsChanges = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key);
        }
    };

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
                <TrendingItem item={item} activeItem={activeItem} />
            )}
            onViewableItemsChanged={viewableItemsChanges}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70,
            }}
            contentOffset={{ x: 170, y: 0 }}
            horizontal
        />
    );
};

export default Trending;
