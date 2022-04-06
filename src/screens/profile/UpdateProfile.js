import { StyleSheet, Text, View,TouchableOpacity,Image,TextInput,Alert } from 'react-native'
import React,{useState,useEffect} from 'react'
import {COLORS} from '../../constants'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import AsyncStorage from '@react-native-async-storage/async-storage'
import urlUser from '../../api/api_user'
import {launchImageLibrary} from 'react-native-image-picker'
const UpdateProfile = (props) => {
  const {navigation} = props
  const [profile, setProfile] = useState();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();
  const [image, setImage] = useState();
  const [base64, setBase64] = useState("");
  const [tmp, setTmp] = useState();
  const options ={
    title:'Select image',
    type: 'library',
    options:{
      maxHeight:120,
      maxWidth:120,
      selectionLimit:1,
      mediaType: 'photo',
      includeBase64:true
    }
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
          setBase64(json.data.image);
          setImage(json.data.image);
          setTmp(json.data.image);
          setName(json.data.name);
          setAddress(json.data.address);
          setPhone(json.data.phone);
        }
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getProfile();
  }, []);

  const pickImage = async () => {
    let result = await launchImageLibrary(options)
    if (!result.cancelled) {
      setImage(result.uri);
    }
    const formData = new FormData()
    const xhr = new XMLHttpRequest()
    formData.append('image',{
      uri:image,
      type:'image/jpeg',
      name: 'photo.jpg'
    })
  }

  async function updateProfile(name, phone, address, image, email) {
    if (base64.length > 11000) {
      Alert.alert("hình quá to tròn");
      setImage(tmp);
    } else {
      await fetch(urlUser.ipv4 + "updateProfile", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          address: address,
          image: image,
          email: email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          Alert.alert("Bạn sửa thành công");
          AsyncStorage.removeItem("t");
          AsyncStorage.setItem("t", data.access_token);
          navigation.navigate("Profile", { profile: data.profile });
        })
        .catch((error) => console.log("error: ", error.message));
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewAvt}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            style={styles.imgAvt}
            source={{
              uri: image,
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.viewInput}>
        <FontAwesome name="envelope" size={20} color="orange" />
        <View style={styles.viewTitle}>
          <Text style={styles.title}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder={profile ? profile.email : ""}
            editable={false}
          ></TextInput>
        </View>
      </View>
      <View style={styles.viewInput}>
        <FontAwesome name="user" size={20} color="orange" />
        <View style={styles.viewTitle}>
          <Text style={styles.title}>Tên</Text>
          <TextInput
            style={styles.input}
            defaultValue={profile ? profile.name : ""}
            onChangeText={(e) => setName(e)}
          ></TextInput>
        </View>
      </View>
      <View style={styles.viewInput}>
        <FontAwesome name="phone-alt" size={20} color="orange" />
        <View style={styles.viewTitle}>
          <Text style={styles.title}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            defaultValue={profile ? profile.phone : ""}
            onChangeText={(e) => setPhone(e)}
          ></TextInput>
        </View>
      </View>
      <View style={styles.viewInput}>
        <FontAwesome name="map-marker-alt" size={20} color="orange" />
        <View style={styles.viewTitle}>
          <Text style={styles.title}>Địa chỉ</Text>
          <TextInput
            style={styles.input}
            placeholder="Cong Vien Phan Mem Quang Trung"
            defaultValue={profile ? profile.address : ""}
            onChangeText={(e) => setAddress(e)}
          ></TextInput>
        </View>
      </View>
      {/* <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CP", { isForgot: false, email: profile.email })
          }
          style={styles.btnCheckout}
        >
          <Text
            style={{
              fontWeight: "bold",
              color:'white',
              fontSize: 17,
            }}
          >
            Đổi mật khẩu
          </Text>
        </TouchableOpacity>
      </View> */}
      <View style={{ alignItems: "center",marginTop:100 }}>
        <TouchableOpacity
          onPress={() =>
            updateProfile(name, phone, address, base64, profile.email)}
          style={styles.btnCheckout}
        >
          <Text
            style={{
              fontWeight: "bold",
              color:'white',
              fontSize: 17,
            }}
          >
            Lưu thông tin
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default UpdateProfile

const styles = StyleSheet.create({
  btnCheckout: {
    width: "70%",
    height: 40,
    backgroundColor: 'orange',
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  textUpdate: {
    color: COLORS.primary,
  },
  ViewUpdate: {
    justifyContent: "flex-end",
    margin: 5,
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft:20,
    paddingRight: 20,
  },
  image: {
    width: "100%",
    height: 150,
    position: "absolute",
  },
  viewAvt: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  imgAvt: {
    borderWidth: 0.5,
    borderColor:'grey',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor:'grey',
    borderWidth: 2,
    borderColor: "orange",
  },
  viewInput: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    width:'90%'
  },
  viewTitle: {
    width: "100%",
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color:'grey',
  },
  input: {
    fontSize: 18,
    fontWeight: "400",
    height: 40,
    borderBottomWidth: 0.5,
  },
})