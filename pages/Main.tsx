import * as React from 'react';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Linking, Pressable, Text, TouchableOpacity, View} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import {PermissionStatus} from 'expo-media-library';
import {FlatGrid} from "react-native-super-grid";
import {stat} from "react-native-fs";

const Main = () => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [havePermission, setHavePermission] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        const getFiles = async () => {
            setLoading(true)
            const { assets} = await MediaLibrary.getAssetsAsync();
            const selectedImages = assets.map((asset) => {
                const { uri} = asset;
                return { uri };
            })


            setSelectedImages(selectedImages);
            setLoading(false)
        }


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
                    <Text className="text-2xl text-center">You need to give us permission to access your photos</Text>
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
            <View className="flex flex-col items-center justify-center h-screen">
                {selectedImages.length === 0 && (
                    <Text className="text-2xl text-center">You have no images to display :/</Text>
                )}

                {selectedImages.length > 0 && (
                    <FlatGrid
                        itemDimension={80}
                        data={selectedImages}
                        spacing={10}
                        renderItem={({item}) => (
                            <TouchableOpacity className={""} onPress={(event) => {
                                // expand the image to full screen
                                return (
                                    <View className="flex flex-col items-center justify-center h-screen">
                                        <Image source={{uri: item.uri}}
                                               style={{borderRadius: 5, height: 1000, width: 1000}}/>
                                    </View>
                                )
                            }}>
                                <Image source={{uri: item.uri}} style={{borderRadius: 5, height: 100, width: 80}}/>
                                <Text className="text-gray-700">Image</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </>

    );
}

export default Main;