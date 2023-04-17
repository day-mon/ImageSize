import * as React from 'react';
import {Text, View, Button, Image, TouchableOpacity} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import {useEffect, useState} from "react";
import {FlatGrid, SectionGrid} from 'react-native-super-grid';
4
const Main = () => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [havePermission, setHavePermission] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);


    useEffect(() => {

        const getFiles = () => {
            MediaLibrary.getAssetsAsync().then((response) => {
                const {assets} = response;
                const selectedImages = assets.map((asset) => {
                    const { uri} = asset;
                    return { uri };
                })
                setSelectedImages(selectedImages);
            })
        }
        if (!permissionResponse.granted) {
            // now we gotta request permission
            MediaLibrary.requestPermissionsAsync().then((response) => {
                if (!response.granted) return
                getFiles()
            })
            return
        }
        getFiles()
        setHavePermission(true)

    }, [])




if (!havePermission) {
    return (
        <View>
            <Text>Hey you need permission</Text>
        </View>
    )
}


// if not have permission render hey you need permission
return (
    <View>
        {selectedImages.length === 0 && (
            <Text>No images</Text>
        )}

        {selectedImages.length > 0 && (
            <FlatGrid
                itemDimension={100}
                data={selectedImages}
                spacing={10}
                renderItem={({item}) => (
                    <TouchableOpacity >
                        <Image source={{uri: item.uri}} style={{borderRadius: 5, height: 150, width: 100}}/>
                    </TouchableOpacity>
                )}
            />
        )}
    </View>


);
}

export default Main;