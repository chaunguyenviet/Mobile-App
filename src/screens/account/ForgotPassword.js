import React, { useState } from 'react'
import {View, Text, Alert, TextInput, TouchableOpacity,StyleSheet,ImageBackground,ScrollView,Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import urlUser from '../../api/api_user';
import Logo from '../../images/logo.jpg'

const ForgotPassword = ({ navigation, route }) => {
    let email = route.params.email;
    // let email = "huywoaytai@gmail.com";
    const [newP, setNewP] = useState('');
    const [newP2, setNewP2] = useState('');
    const [showP, setShowP] = useState(false);
    const [showP2, setShowP2] = useState(false);

    function changePassword(defaultEmail, newP, newP2) {
        if (validateP(newP, newP2) == true) {
            fetch(urlUser.ipv4 + "change-password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ email: defaultEmail, oldP: "abc", newP: newP, newP2: newP2, forgot: true }),
            }).then(res => res.json())
                .then(data => {
                    if (data.success) {
                        Alert.alert(data.msg)
                        console.log("success");
                        navigation.replace("Login");
                    } else { }

                })
                .catch(err => console.log(err.message))

        } else {
            Alert.alert("Vui lòng kiểm tra lại mật khẩu");
        }
    }

    function validateP(p, p2) {
        if (p.length < 6 || p2.length < 6) {
            return false;
        }
        if (p !== p2) {
            return false;
        }
        return true;
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ImageBackground source={Logo} resizeMode='center'
          style={styles.wellcome}>
        </ImageBackground>
        <View style={[styles.bottomView, { backgroundColor: 'white', marginTop: 7, paddingTop: 20 }]}>
            <Text style={styles.title}>Reset mật khẩu</Text>

            <View style={{ flex: 1, flexDirection: 'column', marginTop: 16 }}>
                <View>
                    <Text style={styles.normal_text}>Mật khẩu tối thiểu 6 ký tự</Text>
                    <Text style={styles.normal_text}>Mật khẩu mới phải trùng khớp với nhau</Text>
                    <Text style={{ marginLeft:20,margin: 5, fontSize: 20, fontWeight: 'bold' }}>Mật khẩu mới</Text>
                    <View style={[styles.input_form, { marginBottom: 20, marginTop: 4 }]}>
                        <TextInput style={styles.input}
                            onChangeText={(p) => setNewP(p)} secureTextEntry={!showP} />
                        <Icon name={showP ? "eyeo" : "eye"} onPress={() => setShowP(!showP)} color="gray" size={20} style={{ marginEnd: 8 }} />
                    </View>

                    <Text style={{marginLeft:20, margin: 5, fontSize: 20, fontWeight: 'bold' }}>Nhập lại mật khẩu mới</Text>
                    <View style={[styles.input_form, { marginBottom: 20, marginTop: 4 }]}>
                        <TextInput
                            style={styles.input} secureTextEntry={!showP2}
                            onChangeText={(p2) => setNewP2(p2)}
                        />
                        <Icon name={showP2 ? "eyeo" : "eye"} onPress={() => setShowP2(!showP2)} color="gray" size={20} style={{ marginEnd: 8 }} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row',margin:20 }}>
                    <TouchableOpacity
                        style={[styles.login_button, {flex: 1, backgroundColor: 'white', borderColor: 'orange', borderWidth: 2, marginRight: 8 }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={[styles.bold_text, { color: 'orange' }]}>Hủy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.login_button, { flex: 1, marginLeft: 8 }]}
                        onPress={() => changePassword(email, newP, newP2)}
                    >
                        <Text style={[styles.bold_text, { color: 'white' }]}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </ScrollView>
    )
}

export default ForgotPassword
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
      title: {
        fontWeight: 'bold',
        color: 'orange',
        fontSize: 30,
        margin: 8,
        marginLeft:20
    },
    normal_text: {
        fontSize: 16,
        marginLeft:20
    },
    input_form: {
        height: 45,
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        borderColor: 'darkgray',
        width:350,
        marginLeft:20
    },
    input: {
        paddingStart: 16,
        paddingEnd: 32,
        color: 'black',
        fontSize: 16,
        flex: 1,
    },
    login_button: {
        borderRadius: 20,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 16,
        marginBottom: 16,
    },
    bold_text: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    })
