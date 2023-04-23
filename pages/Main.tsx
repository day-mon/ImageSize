import * as React from 'react';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Linking, Pressable, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import {PermissionStatus} from 'expo-media-library';
import {FlatGrid} from "react-native-super-grid";
import * as FileSystem from 'expo-file-system' // Updated based on docs


const BYTE = 1;
const KB = 1000 * BYTE;
const MB = 1000 * KB;
const GB = 1000 * MB;



const GREEN_RANGE_MIN = KB * 100;

const YELLOW_RANGE_MIN = KB * 100;
const YELLOW_RANGE_MAX = MB;

const ORANGE_RANGE_MIN = MB;
const ORANGE_RANGE_MAX = MB * 5;

const RED_RANGE = MB * 5;


const Main = () => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [havePermission, setHavePermission] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);


    const getFileSize = async fileUri => {
        let fileInfo = await FileSystem.getInfoAsync(fileUri);
        return fileInfo.exists ? fileInfo?.size : undefined;
    };

    const byteToStorageSize = (bytes: number) => {
        // if it's less than 1 KB
        if (bytes < KB) {
            return bytes.toFixed(2) + " Bytes";
        }
        // if it's between 1 KB and 1 MB
        else if (bytes >= KB && bytes < MB) {
            return (bytes / KB).toFixed(2) + " KB";
        }
        // if it's between 1 MB and 1 GB
        else if (bytes >= MB && bytes < GB) {
            return (bytes / MB).toFixed(2) + " MB";
        }
        // if it's 1 GB or greater
        else {
            return (bytes / GB).toFixed(2) + " GB";
        }
    }

    const getTailwindColorInMB = (size: number) => {
        if (size < GREEN_RANGE_MIN) {
            return 'text-green-600';
        }

        else if (size >= YELLOW_RANGE_MIN && size <= YELLOW_RANGE_MAX) {
            return 'text-yellow-600';
        }

        else if (size >= ORANGE_RANGE_MIN && size <= ORANGE_RANGE_MAX) {
            return 'text-orange-600';
        }

        else {
            return 'text-red-600';
        }

    }

    const getFiles = async (after?: string) => {
        setLoading(true)
        let batch = 100;
        const media = await MediaLibrary.getAssetsAsync({first: batch, after});
        const selectedImages = media.assets.map((asset) => {
            const {uri, filename} = asset;
            return {uri, filename};
        })

        const images = await Promise.all(selectedImages.map(async (image) => {
            const size = await getFileSize(image.uri);
            return {...image, size}
        }));


        setSelectedImages((prev) => [...prev, ...images]);
        if (media.hasNextPage) {
            void getFiles(media.endCursor)
            return
        }


        setLoading(false)
    }


    useEffect(() => {
        // if we cant ask again or its denied just open setting to get the user to do soemthing
        if (!permissionResponse?.canAskAgain || permissionResponse.status === 'denied') {
            return
        }

        if (permissionResponse.status === 'granted') {
            void getFiles()
            return
        }

        MediaLibrary.requestPermissionsAsync().then((response) => {

            if (response.status === 'granted') {
                void getFiles()
                return
            }
        })

        setHavePermission(true)
    }, [])


    return (
        <>
            {loading && (
                <View className="flex flex-col items-center justify-center h-screen">
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            )}
            {(!permissionResponse?.canAskAgain || permissionResponse?.status === PermissionStatus.DENIED) && (
                <View className="flex flex-col items-center  justify-center h-screen">
                    <Text className="text-2xl text-center">You need to give us permission to access your
                        photos</Text>
                    <Pressable onPress={() => {
                        if (!permissionResponse.canAskAgain) {
                            void Linking.openSettings()
                            return
                        }

                        requestPermission().then((response) => {
                            if (response.status === 'granted') {
                                setHavePermission(true)
                            }
                        })
                    }} className="bg-gray-700 p-2 rounded mt-4">
                        <Text className="text-white">Request Permission</Text>
                    </Pressable>
                </View>
            )}
            <SafeAreaView className="flex flex-col items-center justify-center h-screen">

                {selectedImages.length > 0 && (
                    <FlatGrid
                        itemDimension={80}
                        data={selectedImages}
                        spacing={10}
                        renderItem={({item}) => (
                            <TouchableOpacity className={""} onPress={(event) => {
                                // would you like to delete this image?
                                // if yes then delete it
                                alert(item.filename)

                            }}>
                                <Image source={{uri: item.uri}} style={{borderRadius: 5, height: 100, width: 80}}/>
                                <Text
                                    className={`${getTailwindColorInMB(item.size)} font-bold`}>{byteToStorageSize(item.size)}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </SafeAreaView>
        </>

    );
}

export default Main;