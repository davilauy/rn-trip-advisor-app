import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as Firebase from "firebase";
import { reauthenticate } from "../../Utils/ApiFirebase";

export default function ChangePasswordForm(props) {
  const { setIsVisibleModal, toastRef } = props;

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState();
  const [newPassword, setNewPassowrd] = useState();
  const [repeatNewPassword, setRepeatNewPassword] = useState();

  const [hidePassword, setHidePassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideRepeatNewPassword, setHideRepeatNewPassword] = useState(true);

  const updatePassword = () => {
    setError({});
    let objError = {};

    if (!password || !newPassword || !repeatNewPassword) {
      !password && (objError.password = "No puede estar vacio");
      !newPassword && (objError.newPassword = "No puede estar vacio");
      !repeatNewPassword &&
        (objError.repeatNewPassowrd = "No puede estar vacio");

      setError(objError);
    } else {
      if (password === newPassword) {
        setError({
          newPassword: "Debe ingresar una contrasenia diferente de la actual"
        });
      } else {
        if (newPassword !== repeatNewPassword) {
          !newPassword &&
            (objError.newPassword = "Las contrasenias nuevas no coinciden");
          !repeatNewPassword &&
            (objError.repeatNewPassowrd =
              "Las contrasenias nuevas no coinciden");

          setError(objError);
        } else {
          setIsLoading(true);

          reauthenticate(password)
            .then(() => {
              Firebase.auth()
                .currentUser.updatePassword(newPassword)
                .then(() => {
                  setIsLoading(false);
                  toastRef.current.show(
                    "Contrasenia actualizada correctamente"
                  );
                  setIsVisibleModal(false);
                  Firebase.auth().signOut();
                })
                .catch(() => {
                  setIsLoading(false);
                  setError({
                    password: "Ha ocurrido un error al actualizar contrasenia"
                  });
                });
            })
            .catch(() => {
              setError({ password: "La contrasenia no es correcta" });
              setIsLoading(false);
            });
        }
      }
    }
  };
  return (
    <View>
      <Input
        placeholder="Contrasenia actual"
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
      <Input
        placeholder="Contrasenia nueva"
        containerStyle={styles.input}
        onChange={e => setNewPassowrd(e.nativeEvent.text)}
        password={true}
        secureTextEntry={hideNewPassword}
        rightIcon={{
          type: "material-community",
          name: hideNewPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPassword(!hideNewPassword)
        }}
        errorMessage={error.newPassword}
      />
      <Input
        placeholder="Repetir contrasenia nueva"
        containerStyle={styles.input}
        onChange={e => setRepeatNewPassword(e.nativeEvent.text)}
        password={true}
        secureTextEntry={hideRepeatNewPassword}
        rightIcon={{
          type: "material-community",
          name: hideRepeatNewPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideRepeatNewPassword(!hideRepeatNewPassword)
        }}
        errorMessage={error.repeatNewPassowrd}
      />
      <Button
        title="Cambiar contrasenia"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={updatePassword}
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
