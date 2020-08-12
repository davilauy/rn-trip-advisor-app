import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Image } from "react-native-elements";
import * as Firebase from "firebase";
import CarouselImages from "../../components/CarouselImages";

const ScreenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation } = props;
  const { restaurant } = props.route.params.restaurant.item;

  navigation.setOptions({ title: restaurant.name });

  const [imagesRestaurant, setImagesRestaurant] = useState([]);

  useEffect(() => {
    const arrayUrls = [];

    (async () => {
      await Promise.all(
        restaurant.images.map(async image => {
          await Firebase.storage()
            .ref(`restaurants/images/${image}`)
            .getDownloadURL()
            .then(url => {
              arrayUrls.push(url);
            });
        })
      );
      setImagesRestaurant(arrayUrls);
    })();
  }, []);

  return (
    <View>
      <CarouselImages
        images={imagesRestaurant}
        height={250}
        width={ScreenWidth}
      />

      <Text>Estamos en restaurante</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: "grey"
  },
  indicatorActive: {
    backgroundColor: "tomato"
  }
});
