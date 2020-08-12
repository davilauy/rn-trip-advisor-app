import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../Utils/Validation";
import Loading from "../Loading";
import * as Firebase from "firebase";

export default function LoginForm(props) {
  const { navigation, toastRef } = props;
  const durationToast = 700;

  const [isVisibleLoading, setIsVisibleLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [hidePassword, setHidePassword] = useState(true);

  const login = async () => {
    const isValidEmail = validateEmail(email);

    if (!email || !password) {
      toastRef.current.show("Todos los campos son obligatorios", durationToast);
    } else if (!isValidEmail) {
      toastRef.current.show("Correo electronico no es correcto", durationToast);
    } else {
      setIsVisibleLoading(true);

      await Firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => navigation.navigate("Cuenta"))
        .catch(e => {
          let errorCode = e.code;

          if (errorCode == "auth/user-not-found")
            toastRef.current.show(
              "No existe cuenta registrada con ese correo electronico",
              durationToast
            );
          else if (errorCode == "auth/wrong-password")
            toastRef.current.show(
              "La contrasenia es incorrecta",
              durationToast
            );
          else
            toastRef.current.show(
              "Ha ocurrido un error inesperado",
              durationToast
            );
        });
    }

    setIsVisibleLoading(false);
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo electronico"
        containerStyle={styles.inputForm}
        onChange={e => setEmail(e.nativeEvent.text)}
        rightIcon={
          <Icon type="material-community" name="at" style={styles.rightIcon} />
        }
      />
      <Input
        placeholder="Contrasenia"
        containerStyle={styles.inputForm}
        secureTextEntry={hidePassword}
        onChange={e => setPassword(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            onPress={() => setHidePassword(!hidePassword)}
            style={styles.iconRight}
          />
        }
      />
      <Button
        title="Iniciar sesion"
        onPress={login}
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
      />
      <Loading isVisible={isVisibleLoading} text="Iniciando sesion.." />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  iconRight: { color: "#c1c1c1" },
  inputForm: {
    width: "100%",
    marginTop: 20
  },
  btnContainerLogin: {
    marginTop: 20,
    marginBottom: 20,
    width: "95%"
  },
  btnLogin: {
    backgroundColor: "tomato"
  }
});
