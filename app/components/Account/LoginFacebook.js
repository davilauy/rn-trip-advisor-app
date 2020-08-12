import React, { useState, Fragment } from "react";
import { SocialIcon } from "react-native-elements";
import * as Firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../Utils/Social";
import Loading from "../Loading";

export default function LoginFacebook(props) {
  const { navigation, toastRef } = props;
  const durationToast = 700;
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);

  const login = async () => {
    try {
      await Facebook.initializeAsync(FacebookApi.application_id);
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: FacebookApi.permissions
      });

      if (type === "success") {
        setIsVisibleLoading(true);
        const credentials = Firebase.auth.FacebookAuthProvider.credential(
          token
        );
        await Firebase.auth()
          .signInWithCredential(credentials)
          .then(() => navigation.navigate("Cuenta"))
          .catch(e => {
            toastRef.current.show(
              "Ha ocurrido un error inesperado",
              durationToast
            );
          });
      } else {
        toastRef.current.show(
          "Debe aceptar iniciar sesion en Facebook",
          durationToast
        );
      }
      setIsVisibleLoading(false);
    } catch ({ message }) {
      toastRef.current.show("Ha ocurrido un error inesperado", durationToast);
      console.log(`Facebook Login Error: ${message}`);
      setIsVisibleLoading(false);
    }
  };

  return (
    <Fragment>
      <SocialIcon
        title="Iniciar sesion con Facebook"
        type="facebook"
        button
        onPress={login}
      />
      <Loading isVisible={isVisibleLoading} text="Iniciando sesion..." />
    </Fragment>
  );
}
