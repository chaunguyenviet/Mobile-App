import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, TextInput, StyleSheet,ScrollView,ImageBackground, TouchableOpacity, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants';
import Logo from '../../images/logo.jpg'
import urlUser from '../../api/api_user';
const screen = Dimensions.get('window');
const ChangePassword = ({ navigation, route }) => {
    let { isForgot, email } = route.params
    let i = isForgot;
    // let defaultEmail = "huywoaytai@gmail.com";
    const [e, setE] = useState('')
    const [currentP, setCurrentP] = useState('');
    const [newP, setNewP] = useState('');
    const [newP2, setNewP2] = useState('');
    const [showP1, setShowP1] = useState(false)
    const [showP2, setShowP2] = useState(false)
    const [showP3, setShowP3] = useState(false)

    function changePassword(defaultEmail, currentP, newP, newP2) {
        if (currentP.length == 0) {
            Alert.alert("Hãy nhập mật khẩu hiện tại");
            return;
        }
        if (validateP(newP, newP2) == true) {
            fetch(urlUser.ipv4 + "change-password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ oldP: currentP, newP: newP, newP2: newP2, email: defaultEmail, forgot: false }),
            }).then(res => {
                if (res.status == 200) {
                    // ToastAndroid.show(json.msg, ToastAndroid.SHORT);
                    return { msg: "Đổi mật khẩu thành công!" }
                    // navigation.replace("SignIn");
                } else {
                    return res.json();
                }
            })
                .then(data => {
                    Alert.alert(data.msg)
                    console.log("success");
                })
                .catch(err => console.log(err.message))

        } else {
            Alert.alert(validateP(newP, newP2));
        }
    }

    function forgotP(e) {
        if (e.length == 0) {
            // ToastAndroid.show("Hãy nhập mật khẩu hiện tại",ToastAndroid.SHORT)
            console.log("Hãy nhập địa chỉ email");
            return;
        }
        fetch(urlUser.ipv4 + "get-otp", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ email: e }),
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    navigation.navigate("Otp", { email: e, otp: data.data })
                } else {
                    Alert.alert(data.msg)
                }
            })
            .catch(err => console.log(err.message))
    }

    function validateP(p, p2) {
        if (p.length == 0 || p2.length == 0) {
            return "Hãy nhập mật khẩu";
        }
        if (p.length < 6 || p2.length < 6) {
            return "Mật khẩu tối thiểu 6 ký tự";
        }
        if (p !== p2) {
            return "Mật khẩu không mới trùng khớp";
        }
        return true;
    }

    function updateP(e, currentP, newP, newP2, i, defaultEmail) {
        // dùng isForgot, biến i là tạm thời
        if (i) {
            forgotP(e);
        } else {
            changePassword(defaultEmail, currentP, newP, newP2);
        }
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{i ? 'Reset mật khẩu' : 'Đổi mật khẩu'}</Text>
            <View style={{ flexDirection: 'column', marginTop: 16 }}>

                {i ?
                    <View>
                        <Text style={[styles.normal_text, { marginBottom: 20 }]}>Nhập email để lấy mã OTP đặt lại mật khẩu của bạn.</Text>

                        <Text style={{ margin: 5 }}>Email</Text>
                        <View style={[styles.input_form, { marginBottom: 16 }]}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(p) => setE(p)}
                                placeholder="Email"
                            />
                        </View>
                    </View>
                    :
                    <View>
                        <Text style={{margin:5,fontSize:20,fontWeight:'bold'}}>Mật khẩu hiện tại</Text>
                        <View style={[styles.input_form, { marginBottom: 20, marginTop: 4 }]}>
                            <TextInput
                                style={styles.input} secureTextEntry={!showP1}
                                onChangeText={(cp) => setCurrentP(cp)}
                            />
                            <Icon name={showP1 ? "eyeo" : "eye"} onPress={() => setShowP1(!showP1)} color="gray" size={20} style={{ marginEnd: 8 }} />
                        </View>

                        <Text style={{margin:5,fontSize:20,fontWeight:'bold'}}>Mật khẩu mới</Text>
                        <View style={[styles.input_form, { marginBottom: 20, marginTop: 4 }]}>
                            <TextInput
                                style={styles.input} secureTextEntry={!showP2}
                                onChangeText={(p) => setNewP(p)}
                            />
                            <Icon name={showP2 ? "eyeo" : "eye"} onPress={() => setShowP2(!showP2)} color="gray" size={20} style={{ marginEnd: 8 }} />

                        </View>

                        <Text style={{margin:5,fontSize:20,fontWeight:'bold'}}>Nhập lại mật khẩu mới</Text>
                        <View style={[styles.input_form, { marginBottom: 20, marginTop: 4 }]}>
                            <TextInput
                                style={styles.input} secureTextEntry={!showP3}
                                onChangeText={(p2) => setNewP2(p2)}
                            />
                            <Icon name={showP3 ? "eyeo" : "eye"} onPress={() => setShowP3(!showP3)} color="gray" size={20} style={{ marginEnd: 8 }} />

                        </View>
                    </View>
                }
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={[styles.login_button, { flex: 1, backgroundColor: 'white', borderColor: 'orange', borderWidth: 2, marginRight: 8 }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={[styles.bold_text, { color: COLORS.primary }]}>Hủy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.login_button, { flex: 1, marginLeft: 8 }]}
                        onPress={() => updateP(e, currentP, newP, newP2, i, email)}
                    >
                        <Text style={[styles.bold_text, { color: 'white' }]}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default ChangePassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#e6e6e6',
        paddingTop: 5,
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
    },
    normal_text: {
        fontSize: 16,
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
    login_button: {
        borderRadius: 20,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 16,
        marginBottom: 16,
        width:100
    },
    bold_text: {
        fontWeight: 'bold',
        fontSize: 16,
    },
  })