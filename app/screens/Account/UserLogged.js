import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import * as Firebase from "firebase";
import UserInfo from "../../components/Account/UserInfo";
import AccountOptions from "../../components/Account/AccountOptions";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

export default function UserLogged() {
  const [userInfo, setUserInfo] = useState({});
  const [reloadData, setReloadData] = useState(false);

  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [textLoading, setTextLoading] = useState("");
  const durationToast = 700;

  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      const user = await Firebase.auth().currentUser;
      setUserInfo(user.providerData[0]);
    })();
    setReloadData(false);
  }, [reloadData]);

  return (
    <View style={styles.viewUserInfo}>
      <UserInfo
        userInfo={userInfo}
        toastRef={toastRef}
        setReloadData={setReloadData}
        setIsVisibleLoading={setIsVisibleLoading}
        setTextLoading={setTextLoading}
        durationToast={durationToast}
      />
      <AccountOptions
        userInfo={userInfo}
        setReloadData={setReloadData}
        toastRef={toastRef}
      />
      <Button
        title="Cerrar sesion"
        buttonStyle={styles.btnLogout}
        titleStyle={styles.btnLogoutTitle}
        onPress={() => Firebase.auth().signOut()}
      />
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isVisibleLoading} text={textLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    minHeight: "100%",
    backgroundColor: "#f2f2f2"
  },
  btnLogout: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingTop: 10,
    paddingBottom: 10
  },
  btnLogoutTitle: {
    color: "tomato"
  }
});
