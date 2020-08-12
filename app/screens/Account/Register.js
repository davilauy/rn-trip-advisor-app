import React, { useRef } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-easy-toast";

import RegisterForm from "../../components/Account/RegisterForm";

export default function Register() {
  const navigation = useNavigation();
  const toastRef = useRef();
  return (
    <KeyboardAwareScrollView>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.viewForm}>
        <RegisterForm navigation={navigation} toastRef={toastRef} />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.5} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20
  },
  viewForm: {
    marginRight: 40,
    marginLeft: 40
  }
});
