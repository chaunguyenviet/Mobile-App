import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Logo from '../../images/logo.jpg'
import Icon from 'react-native-vector-icons/AntDesign'
import urlUser from '../../api/api_user'
import AsyncStorage from '@react-native-async-storage/async-storage';
export const LoginScreen = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState("");
  const [showP, setShowP] = useState(false);
  const login = (email, password) => {
    if (!email.trim()) {
      Alert.alert("Không được để trống email");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Không được để trống password");
      return;
    } else {
      fetch(urlUser.ipv4 + "login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          if (json.success) {
            AsyncStorage.setItem("t", json.access_token);
            navigation.replace("MyTabs");
          } else {
            Alert.alert("Tài khoản đăng nhập không đúng");
            console.log("ccccc", json.msg);
          }
        })
        .catch((err) => console.log(err));
    }
  };
  React.useEffect(() => {
    async function fetchData() {
      let token = await AsyncStorage.getItem("t");
      fetch(urlUser.ipv4 + "check", {
        method: "POST",
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json',
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            AsyncStorage.setItem("email", json.data.email);
            AsyncStorage.setItem("name", json.data.name);
            AsyncStorage.setItem("phone", json.data.phone);
            AsyncStorage.setItem("image", json.data.image);
            AsyncStorage.setItem("active", json.data.active);
            navigation.replace("MyTabs");
          }
        })
        .catch((err) => console.log(err));
    }
    fetchData()
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground source={Logo} resizeMode='center'
        style={styles.wellcome}>
      </ImageBackground>
      <View style={styles.bottomView}>
        <View style={{ padding: 30 }}>
          <Text style={styles.title}>Đăng nhập</Text>
          <View>
            <Text style={{ margin: 5 }}>Email</Text>
            <View style={styles.input_form}>
              <TextInput style={styles.input} value={email} placeholder='Email'
                onChangeText={(text) => setEmail(text)} placeholderTextColor='gray' />
            </View>
            <View>
              <Text style={{ margin: 5 }}>Password</Text>
              <View style={styles.input_form}>
                <TextInput style={styles.input} value={password} placeholder='Password'
                  onChangeText={(text) => setPassword(text)} placeholderTextColor='gray' secureTextEntry={!showP} />
                <Icon name={showP ? "eyeo" : "eye"} onPress={() => setShowP(!showP)} color="gray" size={20} style={{ marginEnd: 8 }} />

              </View>
            </View>
            <Text
              onPress={() => navigation.navigate("CP", { isForgot: true })}
              style={{
                alignSelf: "flex-end",
                color: "#1f222b",
                marginVertical: 16,
              }}
            >
              Quên mật khẩu?
            </Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>

              <TouchableOpacity style={styles.bottomBtn} onPress={() => login(email, password)}>
                <Text style={{ color: 'white', fontSize: 25 }}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center", margin: 15 }}>
              <Text style={[styles.bold_text, { marginBottom: 8 }]}>
                Chưa có tài khoản?
              </Text>
              <Text
                onPress={() => navigation.replace("Register")}
                style={[styles.bold_text, styles.underline_text]}
              >
                Đăng ký ngay
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>

  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  wellcome: {
    height: Dimensions.get('window').height / 2.5
  },
  bottomView: {
    flex: 1.5,
    backgroundColor: '#ebebeb',
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
    borderColor: 'orange',
    borderWidth: 1,
    height: 470
  },
  bottomBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    height: 50,
    width: '60%',
    borderRadius: 30,
  },
  title: {
    fontWeight: 'bold',
    color: 'orange',
    fontSize: 30,
    margin: 8,
  },
  input_form: {
    height: 45,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    borderColor: 'darkgray'
  },
  input: {
    paddingStart: 16,
    paddingEnd: 32,
    color: 'black',
    fontSize: 16,
    flex: 1,
  },
  underline_text: {
    fontSize: 16,
    textDecorationLine: 'underline',
  }
})