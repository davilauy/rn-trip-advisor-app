import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar } from "react-native-elements";
import * as Firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default function UserInfo(props) {
  const {
    userInfo: { uid, displayName, email, photoURL },
    toastRef,
    setReloadData,
    setIsVisibleLoading,
    setTextLoading,
    durationToast
  } = props;

  const changeAvatar = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    const { status } = resultPermissions.permissions.cameraRoll;
    if (status !== "granted") {
      toastRef.current.show("Debe aceptar los permisos", durationToast);
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (result.cancelled) {
        toastRef.current.show(
          "No ha seleccionado ninguna imagen",
          durationToast
        );
      } else {
        uploadImage(result.uri, uid)
          .then(() => updateUserImage(uid))
          .catch(() => {
            toastRef.current.show(
              "Ha ocurrido un error al subir imagen",
              durationToast
            );
          });
      }
    }
  };

  const uploadImage = async (uri, nameImage) => {
    setTextLoading("Actualizando avatar...");
    setIsVisibleLoading(true);
    const response = await fetch(uri);
    const blobImage = await response.blob();

    const ref = Firebase.storage()
      .ref()
      .child(`userInfo/avatar/${nameImage}`);
    return ref.put(blobImage);
  };

  const updateUserImage = uid => {
    Firebase.storage()
      .ref(`userInfo/avatar/${uid}`)
      .getDownloadURL()
      .then(async url => {
        const updateUser = Firebase.auth().currentUser;

        await updateUser
          .updateProfile({
            photoURL: url
          })
          .then(() => {
            toastRef.current.show(
              "Imagen actualizada correctamente",
              durationToast
            );
            setReloadData(true);
            setIsVisibleLoading(false);
          })
          .catch(() => {
            toastRef.current.show(
              "Error al actualizar avatar en perfil",
              durationToast
            );
            setIsVisibleLoading(false);
          });
      })
      .catch(e => {
        toastRef.current.show(
          "Error al recuperar imagen del servidor",
          durationToast
        );
        setIsVisibleLoading(false);
      });
  };

  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        showEditButton
        onEditPress={changeAvatar}
        containerStyle={styles.userInfoAvatar}
        source={{
          uri: photoURL ? photoURL : "https://i.pravatar.cc/300"
        }}
      />
      <View>
        <Text style={styles.displayName}>
          {displayName ? displayName : "Sin info"}
        </Text>
        <Text>{email ? email : "Sesion iniciada con Facebook"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingTop: 30,
    paddingBottom: 30
  },
  userInfoAvatar: {
    marginRight: 20
  },
  displayName: {
    fontWeight: "bold"
  }
});
