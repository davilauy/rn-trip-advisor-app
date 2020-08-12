import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import ListRestaurants from "../Restaurants/ListRestaurants";

import * as Firebase from "firebase/app";
import { firebaseApp } from "../../Utils/Firebase";
import "firebase/firestore";

const db = Firebase.firestore(firebaseApp);

export default function Restaurants() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [listRestaurants, setListRestaurants] = useState([]);
  const [startRestaurant, setStartRestarant] = useState(null);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const limitRestaurants = 6;

  const [isReloadRestaurant, setIsReloadRestaurant] = useState(false);

  useEffect(() => {
    Firebase.auth().onAuthStateChanged(userInfo => {
      setUser(userInfo);
    });
  }, []);

  useEffect(() => {
    db.collection("restaurants")
      .get()
      .then(snap => {
        setTotalRestaurants(snap.size);
      })
      .catch(() => {
        console.log("error al obtener restaurantes");
      });

    (async () => {
      const resultRestaurants = [];
      const restaurants = db
        .collection("restaurants")
        .orderBy("createAt", "desc")
        .limit(limitRestaurants);

      await restaurants.get().then(snap => {
        setStartRestarant(snap.docs[snap.docs.length - 1]);

        snap.forEach(doc => {
          let restaurant = doc.data();
          restaurant.id = doc.id;

          resultRestaurants.push({
            restaurant
          });
        });

        setListRestaurants(resultRestaurants);
      });
    })();
    setIsReloadRestaurant(false);
  }, [isReloadRestaurant]);

  const handleLoadMore = async () => {
    const resRestaurants = [];
    listRestaurants.length < totalRestaurants && setIsLoading(true);

    const restaurants = db
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurant.data().createAt)
      .limit(limitRestaurants);

    await restaurants.get().then(snap => {
      if (snap.docs.length > 0) {
        setStartRestarant(snap.docs[snap.docs.length - 1]);
      } else {
        setIsLoading(false);
      }

      snap.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;

        resRestaurants.push({
          restaurant
        });
      });

      setListRestaurants([...listRestaurants, ...resRestaurants]);
    });
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
        navigation={navigation}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        listRestaurants={listRestaurants}
        handleLoadMore={handleLoadMore}
      />
      {user && (
        <AddRestaurantButton
          setIsReloadRestaurant={setIsReloadRestaurant}
          navigation={navigation}
        />
      )}
    </View>
  );
}

function AddRestaurantButton(props) {
  const { setIsReloadRestaurant, navigation } = props;

  const actions = [
    {
      text: "Agregar restaurante",
      icon: <MaterialCommunityIcons name="cup" size={22} color="tomato" />,
      name: "add_restaurant",
      position: 0
    }
  ];
  return (
    <FloatingAction
      actions={actions}
      onPressItem={() => {
        navigation.navigate("Agregar Restaurante", { setIsReloadRestaurant });
      }}
      color="tomato"
    />
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  }
});
