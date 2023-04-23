import {Pressable, Text, View} from "react-native";

const TopNav = (props) => {
    // left aligned Filter button
    return (
        <View className="flex flex-row justify-between items-center">
            <Text className="text-2xl font-bold">All</Text>
        </View>
    )
}

export default TopNav;