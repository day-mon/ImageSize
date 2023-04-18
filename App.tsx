import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Main from "./pages/Main";
import {useEffect} from "react";
import * as MediaLibrary from 'expo-media-library';
import {createStackNavigator} from "@react-navigation/stack";
import TopNav from "./components/TopNav";


const Stack = createStackNavigator();


const App = () => {

    useEffect(() => {
        // onMount
        // request permission
        MediaLibrary.requestPermissionsAsync()
            .then((response) => {
                console.log(response);
            })
    }, [])
    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName={'All'} >
                <Stack.Screen name={"All"} component={Main} options={{
                    headerTitle: (props) => <TopNav {...props}/>,
                    headerTitleAlign: 'center'
                }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
