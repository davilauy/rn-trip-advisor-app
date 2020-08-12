import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import RestaurantsScreen from "../screens/Restaurants/Restaurants";
import AddRestaurantScreen from "../screens/Restaurants/AddRestaurant";
import RestaurantScreen from "../screens/Restaurants/Restaurant";

import TopRestaurantsScreen from "../screens/TopRestaurants";

import SearchScreen from "../screens/Search";

import MyAccountScreen from "../screens/Account/MyAccount";
import LoginScreen from "../screens/Account/Login";
import RegisterScreen from "../screens/Account/Register";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Restaurantes" component={RestaurantsScreen} />
      <Stack.Screen
        name="Agregar Restaurante"
        component={AddRestaurantScreen}
      />
      <Stack.Screen name="Restaurante" component={RestaurantScreen} />
    </Stack.Navigator>
  );
}

function TopRestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Top Restaurantes" component={TopRestaurantsScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Buscar Restaurante" component={SearchScreen} />
    </Stack.Navigator>
  );
}

function AccountStack({ navigation: { navigate } }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cuenta" component={MyAccountScreen} />
      <Stack.Screen
        name="Ingresar"
        component={LoginScreen}
        navigate={navigate}
      />
      <Stack.Screen
        name="Registro"
        component={RegisterScreen}
        navigate={navigate}
      />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Restaurantes") {
              iconName = focused ? "cup" : "cup";
            } else if (route.name === "Top 5") {
              iconName = focused ? "star" : "star";
            } else if (route.name === "Buscar") {
              iconName = focused ? "rocket" : "rocket";
            } else if (route.name === "Mi Cuenta") {
              iconName = focused ? "account" : "account";
            }

            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          }
        })}
        tabBarOptions={{
          activeTintColor: "tomato",
          inactiveTintColor: "gray"
        }}
      >
        <Tab.Screen name="Restaurantes" component={RestaurantsStack} />
        <Tab.Screen name="Top 5" component={TopRestaurantsStack} />
        <Tab.Screen name="Buscar" component={SearchStack} />
        <Tab.Screen name="Mi Cuenta" component={AccountStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
