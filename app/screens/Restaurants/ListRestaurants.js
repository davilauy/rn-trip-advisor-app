import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Image } from "react-native-elements";
import * as Firebase from "firebase";

export default function ListRestaurants(props) {
  const { listRestaurants, isLoading, handleLoadMore, navigation } = props;

  return (
    <View>
      {listRestaurants ? (
        <FlatList
          data={listRestaurants}
          renderItem={restaurant => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderRestaurant}>
          <ActivityIndicator size="large" />
          <Text>Cargando restaurantes...</Text>
        </View>
      )}
    </View>
  );
}

function Restaurant(props) {
  const { restaurant, navigation } = props;

  const { name, descripcion, address, images } = restaurant.item.restaurant;
  const [imageRestaurant, setImageRestaurant] = useState("");

  useEffect(() => {
    const image = images[0];

    Firebase.storage()
      .ref(`restaurants/images/${image}`)
      .getDownloadURL()
      .then(url => {
        setImageRestaurant(url);
      });
  });

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Restaurante", { restaurant })}
    >
      <View style={styles.viewRestaurant}>
        <View style={styles.viewRestaurantImage}>
          <Image
            resizeMode="cover"
            source={{ uri: imageRestaurant }}
            style={styles.imageRestaurant}
            PlaceholderContent={<ActivityIndicator color="fff" />}
          />
        </View>
        <View>
          <Text style={styles.restaurantName}>{name}</Text>
          <Text style={styles.restaurantAddress}>{address}</Text>
          <Text style={styles.restarantDescription}>
            {descripcion.substr(0, 60)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loadingRestaurants}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundRestaurants}>
        <Text>No quedan restaurantes por cargar</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingRestaurants: {
    marginTop: 10,
    alignItems: "center"
  },
  viewRestaurant: {
    flexDirection: "row",
    margin: 10
  },
  viewRestaurantImage: {
    marginRight: 15
  },
  imageRestaurant: {
    width: 80,
    height: 80
  },
  restaurantName: {
    fontWeight: "bold"
  },
  restaurantAddress: {
    paddingTop: 2,
    color: "grey"
  },
  restarantDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300
  },
  loaderRestaurant: {
    marginTop: 10,
    marginBottom: 10
  },
  notFoundRestaurants: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center"
  }
});
