import React, { useEffect, useState } from "react";
import {StyleSheet,Text,View,Image,TouchableOpacity,Pressable,Dimensions} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import {COLORS} from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import urlUser from '../../api/api_user';
const WIDTH = Dimensions.get("window");
const ProfileScreen = ({ navigation, route }) => {
  let p = route.params ? route.params.profile : {};
  const [profile, setProfile] = useState(p);
  async function logOut() {
    await AsyncStorage.clear();
    navigation.replace("Login");
  }
  async function getProfile() {
    let token = await AsyncStorage.getItem("t");
    fetch(urlUser.ipv4 + "check", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setProfile(json.data);
        }
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getProfile();
    });
    return unsubscribe;
  }, []);
  return (
      <View style={styles.container}>
        <View style={styles.viewAvt}>
          <Image
            style={styles.img}
            source={{
              uri: profile ? profile.image : "",
            }}
          />
          <View style={{justifyContent:'center',marginBottom:20}}>
          <Text style={styles.textName}>{profile ? profile.name : ""}</Text>
          <Text style={styles.textMail}>{profile ? profile.email : ""}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("UpdateProfileScreen")}
          ></TouchableOpacity>
        </View>
        <View style={styles.viewCard}>
          <View>
            <Pressable
              onPress={() => navigation.navigate("UpdateProfileScreen")}
            >
              <View style={styles.viewTitles}>
                <FontAwesome name="user-edit" size={20} color="orange" />
                <Text style={styles.titles}>Chỉnh sửa thông tin</Text>
                
              </View>
            </Pressable>
            <TouchableOpacity onPress={()=>navigation.navigate("Orders")} style={styles.viewTitles}>
              <FontAwesome name="clipboard-list" size={20} color="orange" />
              <Text style={styles.titles}> Đơn hàng của tôi</Text>
              
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("CP",{isForgot: false, email: profile.email})} style={styles.viewTitles}>
              <FontAwesome name="key" size={20} color="orange" />
              <Text style={styles.titles}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            height: 1,
            width: 150,
            backgroundColor: COLORS.primary,
            opacity: 0.5,
            alignSelf: "center",
          }}
        ></View>
        <TouchableOpacity style={styles.viewTitles} onPress={() => logOut()}>
          <FontAwesome name="sign-out-alt" size={20} color="orange" />
          <Text style={styles.titles}> Đăng Xuất</Text>
        </TouchableOpacity>
      </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  viewCard: {
    flex: 1,
    justifyContent: "space-between",
    borderRadius: 20,
    paddingBottom: 15,
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6',
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 20,
  },
  viewAvt: {
    flexDirection: "row",
    backgroundColor:'orange',
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    height:140
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: WIDTH.width / 2,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderWidth: 3,
    borderColor: COLORS.white,
    marginRight:15
  },
  viewName: {
    justifyContent: "center",
    alignItems: "center",
  },
  textName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
    marginVertical: 15,
  },
  textMail: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.white,
  },
  textUD: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.pale,
  },
  viewTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 15,
  },
  viewTitles: {
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    marginVertical:15
  },
  titles: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.grey,
    marginLeft: 10,
  },
  viewIcon: {
    flex: 1,
    alignItems: "flex-end",
  },
});
