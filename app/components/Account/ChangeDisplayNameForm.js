import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as Firebase from "firebase";

export default function ChangeDisplayNameForm(props) {
  const { displayName, setIsVisibleModal, setReloadData, toastRef } = props;
  const [newDisplayName, setNewDisplayName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateDisplayName = () => {
    setError(null);

    if (!newDisplayName) {
      setError("El nombre se usuario no puede estar vacio");
    } else {
      setIsLoading(true);

      const update = { displayName: newDisplayName };

      Firebase.auth()
        .currentUser.updateProfile(update)
        .then(() => {
          setIsLoading(false);
          setReloadData(true);
          toastRef.current.show("Nombre actualizado correctamente", 700);
          setIsVisibleModal(false);
        })
        .catch(() => {
          setError("Error al actualizar nombre");
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Nombre"
        containerStyle={styles.input}
        defaultValue={displayName && displayName}
        onChange={e => setNewDisplayName(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2"
        }}
        errorMessage={error}
      />
      <Button
        title="Cambiar nombre"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={updateDisplayName}
        loading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  input: {
    marginBottom: 10
  },
  btnContainer: {
    marginTop: 20,
    width: "100%"
  },
  btn: {
    backgroundColor: "tomato"
  }
});
