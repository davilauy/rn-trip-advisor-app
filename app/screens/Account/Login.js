import React, { useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import LoginForm from "../../components/Account/LoginForm";
import LoginFacebook from "../../components/Account/LoginFacebook";

export default function Login() {
  const navigation = useNavigation();
  const toastRef = useRef();
  return (
    <ScrollView>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.viewContainer}>
        <LoginForm navigation={navigation} toastRef={toastRef} />
        <CreateAccount navigation={navigation} />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.viewContainer}>
        <LoginFacebook navigation={navigation} toastRef={toastRef} />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.5} />
    </ScrollView>
  );
}

function CreateAccount(props) {
  const { navigation } = props;

  return (
    <Text styles={styles.textRegister}>
      Aun no tienes una cuenta?{" "}
      <Text
        style={styles.btnRegister}
        onPress={() => navigation.navigate("Registro")}
      >
        Registrarme
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20
  },
  viewContainer: {
    marginRight: 40,
    marginLeft: 40
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10
  },
  btnRegister: {
    color: "tomato",
    fontWeight: "bold"
  },
  divider: {
    backgroundColor: "tomato",
    margin: 20
  }
});
