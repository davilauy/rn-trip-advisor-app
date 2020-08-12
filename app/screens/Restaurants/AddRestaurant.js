import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddRestaurantForm from "../../components/Restaurants/AddRestaurantForm";

export default function AddRestaurant(props) {
  const { setIsReloadRestaurant } = props.route.params;

  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();

  const navigation = useNavigation();

  return (
    <View>
      <AddRestaurantForm
        navigation={navigation}
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        setIsReloadRestaurant={setIsReloadRestaurant}
      />
      <Loading isVisible={isLoading} text="Creando restaurante" />
      <Toast ref={toastRef} position="center" opacity={0.5} />
    </View>
  );
}
