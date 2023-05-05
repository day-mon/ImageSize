import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Main from "./pages/Main";
import {useEffect} from "react";
import * as MediaLibrary from 'expo-media-library';
import {createStackNavigator} from "@react-navigation/stack";
import TopNav from "./components/TopNav";
import {PermissionStatus} from "expo-media-library";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Statistics from "./pages/Statistics";
import {RouteProp} from "@react-navigation/core/lib/typescript/src/types";



const pages = [
    {
        component: Main,
        name: 'All',
        activeIcon: <Fontisto name="picture" size={15} color="black" />,
        notActiveIcon: <Fontisto name="picture" size={12} color="grey" />
    },
    {
        component: Statistics,
        name: 'Stats',
        activeIcon: <AntDesign name="piechart" size={15} color="black" />,
        notActiveIcon: <AntDesign name="piechart" size={12} color="grey" />
    },

]

// const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {

    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();


    useEffect(() => {
        // onMount
        // request permission

        if (permissionResponse?.status === PermissionStatus.DENIED) {
            return
        }

        MediaLibrary.requestPermissionsAsync()
            .then((response) => {
                console.log(response);
            })
    }, [])
    return (
        <NavigationContainer >
            <Tab.Navigator initialRouteName={'All'} >
                {pages.map((page) => {
                    return (
                        <Tab.Screen
                            name={page.name}
                            component={page.component}
                            options={{
                                headerTitle: (props) => <TopNav {...props}/>,
                                tabBarIcon: ({focused}) => focused ? page.activeIcon : page.notActiveIcon,
                                headerTitleAlign: 'center'
                            }}
                        />
                    )
                })}
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default App;
