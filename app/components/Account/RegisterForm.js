import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../Utils/Validation";
import * as Firebase from "firebase";
import Loading from "../../components/Loading";

export default function RegisterForm(props) {
  const { navigation, toastRef } = props;
  const durationToast = 700;

  const [isVisibleLoading, setIsVisibleLoading] = useState(false);

  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const register = async () => {
    const isValidEmail = validateEmail(email);

    if (!email || !password || !repeatPassword) {
      toastRef.current.show("Todos los campos son obligatorios", durationToast);
    } else {
      if (!isValidEmail) {
        toastRef.current.show(
          "Correo electronico no es correcto",
          durationToast
        );
      } else {
        if (password !== repeatPassword) {
          toastRef.current.show(
            "Las contrasenias ingresadas no coinciden",
            durationToast
          );
        } else {
          setIsVisibleLoading(true);
          await Firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => navigation.navigate("Cuenta"))
            .catch(e => {
              let errorCode = e.code;

              if (errorCode == "auth/weak-password")
                toastRef.current.show(
                  "La contrasenia es demasiado facil",
                  durationToast
                );
              else if (errorCode == "auth/email-already-in-use")
                toastRef.current.show(
                  "El correo electronico ya se encuentra registrado",
                  durationToast
                );
              else
                toastRef.current.show(
                  "Ha ocurrido un error inesperado",
                  durationToast
                );
            });

          setIsVisibleLoading(false);
        }
      }
    }
  };

  return (
    <View style={styles.formContainer} behavior="padding" enabled>
      <Input
        placeholder="Correo electronico"
        containerStyle={styles.inputForm}
        onChange={e => setEmail(e.nativeEvent.text)}
        rightIcon={
          <Icon type="material-community" name="at" style={styles.iconRight} />
        }
      />
      <Input
        placeholder="Contrasena"
        password={true}
        secureTextEntry={hidePassword}
        containerStyle={styles.inputForm}
        onChange={e => setPassword(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            style={styles.iconRight}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      />
      <Input
        placeholder="Repetir contrasena"
        password={true}
        secureTextEntry={hideRepeatPassword}
        containerStyle={styles.inputForm}
        onChange={e => setRepeatPassword(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name="eye-outline"
            name={hideRepeatPassword ? "eye-outline" : "eye-off-outline"}
            style={styles.iconRight}
            onPress={() => setHideRepeatPassword(!hideRepeatPassword)}
          />
        }
      />
      <Button
        title="Registrarme"
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={register}
      />
      <Loading isVisible={isVisibleLoading} text="Creando cuenta..." />
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
  inputForm: {
    width: "100%",
    marginTop: 20
  },
  iconRight: { color: "#c1c1c1" },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%"
  },
  btnRegister: {
    backgroundColor: "tomato"
  }
});
