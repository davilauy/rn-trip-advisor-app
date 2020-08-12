import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import Modal from "../Modal";

import "react-native-get-random-values";
import { v5 as uuidv5 } from "uuid";

import * as Firebase from "firebase/app";
import "firebase/firestore";
import { firebaseApp } from "../../Utils/Firebase";

const db = Firebase.firestore(firebaseApp);

const WidthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  const { navigation, toastRef, setIsLoading, setIsReloadRestaurant } = props;
  const [imagesSelected, setImagesSelected] = useState([]);

  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const addRestaurant = () => {
    if (!name || !address || !descripcion) {
      toastRef.current.show(
        "Todos los campos del formulario son obligatorios",
        700
      );
    } else if (imagesSelected.length === 0) {
      toastRef.current.show(
        "El restaurante debe de tener al menos una imagen",
        700
      );
    } else if (!locationRestaurant) {
      toastRef.current.show("Debe localizar el restaurante en el mapa", 700);
    } else {
      setIsLoading(true);
      uploadImageStorage(imagesSelected)
        .then(arrayImages => {
          db.collection("restaurants")
            .add({
              name,
              address,
              descripcion,
              location: locationRestaurant,
              images: arrayImages,
              rating: 0,
              ratingTotal: 0,
              quantityVoting: 0,
              createAt: new Date(),
              createBy: firebaseApp.auth().currentUser.uid
            })
            .then(() => {
              setIsLoading(false);
              setIsReloadRestaurant(true);
              navigation.navigate("Restaurantes");
            })
            .catch(() => {
              toastRef.current.show(
                "Ha ocurrido un error al crear restaurante",
                700
              );
              setIsLoading(false);
            });
        })
        .catch(() => {
          toastRef.current.show("Ha ocurrido un error al subir imagenes", 700);
          setIsLoading(false);
        });
    }
  };

  const uploadImageStorage = async imagesArr => {
    const imagesBlob = [];

    await Promise.all(
      imagesArr.map(async image => {
        const getImage = await fetch(image);
        const blob = await getImage.blob();

        const refImage = Firebase.storage()
          .ref("restaurants/images")
          .child(
            uuidv5(
              Math.floor(Date.now() / 10).toString(),
              "1b671a64-40d5-491e-99b0-da01ff1f3341"
            )
          );

        await refImage.put(blob).then(result => {
          imagesBlob.push(result.metadata.name);
        });
      })
    );
    return imagesBlob;
  };

  return (
    <ScrollView>
      <ImageRestaurant defaultImage={imagesSelected[0]} />
      <UploadImages
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
        toastRef={toastRef}
      />
      <FormInput
        setName={setName}
        setAddress={setAddress}
        setDescripcion={setDescripcion}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
      />
      <Button
        title="Crear restaurante"
        buttonStyle={styles.btnAdd}
        onPress={addRestaurant}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
        name={name}
      />
    </ScrollView>
  );
}

function ImageRestaurant(props) {
  const { defaultImage } = props;

  return (
    <View styles={styles.viewDefaultImage}>
      {defaultImage ? (
        <Image
          source={{ uri: defaultImage }}
          style={{ width: WidthScreen, height: 200 }}
        />
      ) : (
        <Image
          source={require("../../../assets/images/no-image-restaurant.png")}
          style={{ width: WidthScreen, height: 200 }}
        />
      )}
    </View>
  );
}

function UploadImages(props) {
  const { imagesSelected, setImagesSelected, toastRef } = props;

  const imageChoose = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    const { status } = resultPermissions.permissions.cameraRoll;
    if (status !== "granted") {
      toastRef.current.show(
        "Es necesario aceptar los permisos para acceder a la camara",
        700
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Ha cerrado la galeria sin seleccionar niguna imagen",
          700
        );
      } else {
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };

  const imageRemove = async image => {
    const arrImages = imagesSelected;

    Alert.alert(
      "Eliminar imagen",
      "Seguro que quieres eliminar imagen?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () =>
            setImagesSelected(arrImages.filter(imageUri => imageUri !== image))
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImages}>
      {imagesSelected.length < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={() => imageChoose()}
        />
      )}

      {imagesSelected.map((image, index) => (
        <Avatar
          key={index}
          source={{ uri: image }}
          style={styles.miniatureImage}
          onPress={() => imageRemove(image)}
        />
      ))}
    </View>
  );
}

function FormInput(props) {
  const {
    setName,
    setAddress,
    setDescripcion,
    setIsVisibleMap,
    locationRestaurant
  } = props;

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={e => setName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Direccion del restaurante"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant ? "tomato" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true)
        }}
        onChange={e => setAddress(e.nativeEvent.text)}
      />
      <Input
        placeholder="Descripcion del restaurante"
        multiline={true}
        containerStyle={styles.textArea}
        onChange={e => setDescripcion(e.nativeEvent.text)}
      />
    </View>
  );
}

function Map(props) {
  const [location, setLocation] = useState(null);

  const {
    isVisibleMap,
    setIsVisibleMap,
    setLocationRestaurant,
    toastRef,
    name
  } = props;

  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );

      const { status } = resultPermissions.permissions.location;

      if (status !== "granted") {
        toastRef.current.show(
          "Debe aceptar los permisos para acceder a su ubicacion",
          700
        );
      } else {
        const currentPos = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentPos.coords.latitude,
          longitude: currentPos.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        });
      }
    })();
  }, []);

  const saveLocation = () => {
    setLocationRestaurant(location);
    toastRef.current.show("Se ha guardado la localizacion correctamente", 700);
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={region => setLocation(region)}
          >
            <MapView.Marker
              title={name}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              draggable
            />
          </MapView>
        )}
        <View styles={styles.viewMapButton}>
          <Button
            title="Guardar ubicacion"
            onPress={saveLocation}
            containerStyle={styles.mapContainerButton}
            buttonStyle={styles.mapButton}
          />
          <Button
            title="Cancelar"
            onPress={() => setIsVisibleMap(false)}
            containerStyle={styles.mapContainerButton}
            buttonStyle={styles.mapButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewDefaultImage: {
    alignItems: "center",
    height: 100,
    marginBottom: 20
  },
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30
  },
  viewForm: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3"
  },
  miniatureImage: {
    width: 70,
    height: 70,
    marginRight: 10
  },
  input: {
    marginBottom: 10
  },
  textArea: {
    width: "100%",
    height: 100,
    margin: 0,
    padding: 0
  },
  map: {
    width: "100%",
    height: 350
  },
  viewMapButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20
  },
  mapContainerButton: {
    paddingRight: 5,
    marginTop: 10
  },
  mapButton: {
    backgroundColor: "tomato"
  },
  btnAdd: {
    backgroundColor: "tomato",
    margin: 20
  }
});
