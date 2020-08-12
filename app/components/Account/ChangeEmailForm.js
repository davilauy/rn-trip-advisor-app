import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as Firebase from "firebase";
import { reauthenticate } from "../../Utils/ApiFirebase";

export default function ChangeEmailForm(props) {
  const { email, setIsVisibleModal, setReloadData, toastRef } = props;

  const [newEmail, setNewEmail] = useState(null);

  const [password, setPassword] = useState(null);
  const [hidePassword, setHidePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  const updateEmail = () => {
    setError({});

    if (!newEmail || newEmail === email) {
      setError({
        email: "El correo no puede ser igual o no puede estar vacio"
      });
    } else {
      if (!password) {
        setError({ password: "Debe ingresar su contrasenia" });
      } else {
        setIsLoading(true);
        reauthenticate(password)
          .then(() => {
            Firebase.auth()
              .currentUser.updateEmail(newEmail)
              .then(() => {
                setIsLoading(false);
                setReloadData(true);
                toastRef.current.show("Correo actualizado correctamente");
                setIsVisibleModal(false);
              })
              .catch(() => {
                setError({
                  email: "Ha ocurrido un error al actualizar correo"
                });
                setIsLoading(false);
              });
          })
          .catch(() => {
            setError({ password: "La contrasenia no es correcta" });
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Email"
        containerStyle={styles.input}
        defaultValue={email && email}
        onChange={e => setNewEmail(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2"
        }}
        errorMessage={error.email}
      />
      <Input
        placeholder="Contrasenia"
        containerStyle={styles.input}
        onChange={e => setPassword(e.nativeEvent.text)}
        password={true}
        secureTextEntry={hidePassword}
        rightIcon={{
          type: "material-community",
          name: hidePassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHidePassword(!hidePassword)
        }}
        errorMessage={error.password}
      />
      <Button
        title="Cambiar email"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={updateEmail}
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
