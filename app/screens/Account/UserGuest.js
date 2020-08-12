import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";

export default function UserGuest() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.viewBody} centerContent={true}>
      <Image
        source={require("../../../assets/images/user-guest.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Consulta tu perfil de App Test</Text>
      <Text style={styles.description}>
        Como describirias tu mejor resutarante? Busca y visualiza los mejores
        resutarantes de una forma sencilla. Vota cual te ha gustado mas y
        comenta como ha sido tu experiencia.
      </Text>
      <View style={styles.viewBtn}>
        <Button
          buttonStyle={styles.btnStyle}
          containerStyle={styles.btnContainer}
          title="Ver tu perfil"
          onPress={() => {
            navigation.navigate("Ingresar");
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    marginLeft: 30,
    marginRight: 30
  },
  image: {
    height: 300,
    width: "100%",
    marginBottom: 40
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center"
  },
  description: {
    textAlign: "center",
    marginBottom: 20
  },
  viewBtn: {
    flex: 1,
    alignItems: "center"
  },
  btnStyle: {
    backgroundColor: "tomato"
  },
  btnContainer: {
    width: "70%"
  }
});
