import React, { useContext, useState } from 'react'
import { Text, View, StyleSheet, ScrollView, TouchableOpacity,Alert, TextInput, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Logo from '../../images/logo.jpg'
import Icon from 'react-native-vector-icons/AntDesign'
import urlUser from '../../api/api_user'
export const LoginScreen = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState("");
  const [showP, setShowP] = useState(false);
  function register(e, p) {
    if (!email.trim()) {
      Alert.alert("Không được để trống email");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Không được để trống password");
      return;
    } else {
      fetch(urlUser.ipv4 + "sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      })
        .then((res) => {
          if (res.status == 200) {
            Alert.alert("Đăng kí thành công");
            // ToastAndroid.show(json.msg, ToastAndroid.SHORT);
            navigation.replace("Login");
            return { msg: "Đăng kí thành công!" };
          } else {
            return res.json();
          }
        })
        .then((data) => console.log(data.msg))
        .catch((error) => console.log("error: ", error.message));
    }
  }
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground source={Logo} resizeMode='center'
        style={styles.wellcome}>
      </ImageBackground>
      <View style={styles.bottomView}>
        <View style={{ padding: 30 }}>
          <Text style={styles.title}>Đăng Kí</Text>
          <View>
            <Text style={{ margin: 5 }}>Email</Text>
            <View style={styles.input_form}>
              <TextInput style={styles.input} value={email} placeholder='Email'
                onChangeText={(email) => setEmail(email)} placeholderTextColor='gray' />
            </View>
            <View>
              <Text style={{ margin: 5 }}>Password</Text>
              <View style={styles.input_form}>
                <TextInput style={styles.input} value={password} placeholder='Password'
                  onChangeText={(password) => setPassword(password)} placeholderTextColor='gray' secureTextEntry={!showP} />
                <Icon name={showP ? "eyeo" : "eye"} onPress={() => setShowP(!showP)} color="gray" size={20} style={{ marginEnd: 8 }} />

              </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center',marginTop:50 }}>
              <TouchableOpacity style={styles.bottomBtn} onPress={() =>register(email,password)}>
                <Text style={{ color: 'white', fontSize: 25 }}>Đăng Kí</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center", margin: 15 }}>
              <Text style={[styles.bold_text, { marginBottom: 8 }]}>
                Đã có tài khoản?
              </Text>
              <Text
                onPress={() => navigation.replace("Login")}
                style={[styles.bold_text, styles.underline_text]}
              >
                Đăng nhập ngay
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
    borderColor:'orange',
    borderWidth:1,
    height:470
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
},
bold_text: {
  fontWeight: 'bold',
  fontSize: 16,
},
})