import React, { useEffect, useState } from 'react'
import { View, Text, Alert, TextInput, TouchableHighlight,StyleSheet,Dimensions,ImageBackground,ScrollView } from 'react-native'
import { COLORS } from '../../constants';
import Logo from '../../images/logo.jpg'
import urlUser from '../../api/api_user';

const OtpScreen = ({ navigation, route }) => {
    let { email, otp } = route.params;
    const [userOtp, setUserOtp] = useState('')
    const [systemOtp, setSystemOtp] = useState(otp);
    const [preventRequest, setPR] = useState(true);

    function requestOtp() {
        setPR(true);
        countdownGetOtp()
        fetch(urlUser.ipv4 + "forgotP", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ email: email, forgot: true }),
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSystemOtp(data.data);
                } else {
                    Alert.alert(data.msg)
                }
            })
            .catch(err => console.log(err.message))
    }

    useEffect(() => {
        if (userOtp.length == 6) {
            if (userOtp == systemOtp) {
                navigation.replace("ForgotP", { email: email })
            }
            else {
                Alert.alert("Mã OTP không trật khớp. Vui lòng nhập lại!")
                setUserOtp('');
            }
        }
    }, [userOtp])

    function hideEmail(email) {
        return email.replace(/(.{2})(.*)(?=@)/,
            function (gp1, gp2, gp3) {
                for (let i = 0; i < gp3.length; i++) {
                    gp2 += "*";
                } return gp2;
            });
    };

    function countdownGetOtp() {
        setTimeout(() => setPR(false), 183000);
    }

    useEffect(() => {
        countdownGetOtp();
    }, [])
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ImageBackground source={Logo} resizeMode='center'
          style={styles.wellcome}>
        </ImageBackground>
        <View style={[styles.bottomView, { backgroundColor: 'white', paddingTop: 20 }]}>
            <Text style={[styles.title, { alignSelf: 'flex-start' }]}>Lấy mã OTP</Text>
            <View style={{ flexDirection: 'column', marginTop: 16 }}>

                <View style={[styles.input_form, { marginVertical: 16 }]}>
                    <TextInput
                        style={[styles.input, { paddingEnd: 16, textAlign: 'center' }]}
                        placeholder='Nhập mã OTP tại đây'
                        onChangeText={(o) => setUserOtp(o)}
                    />
                </View>

                <TouchableHighlight
                    style={[styles.login_button, { marginLeft:100,backgroundColor: preventRequest ? 'grey' : COLORS.primary }]}
                    onPress={() => requestOtp()}
                    disabled={preventRequest}
                >
                    <Text style={[styles.bold_text, { color: 'white' }]}>Yêu cầu mã OTP</Text>
                </TouchableHighlight>
                {preventRequest && <Text style={styles.normal_text}>Quý khách vui lòng nhập mã OTP đã được gửi đến địa chỉ {hideEmail(email)}</Text>}
            </View>
        </View>
        </ScrollView>
    )
}

export default OtpScreen
const styles = StyleSheet.create({
    login_button: {
        borderRadius: 20,
        backgroundColor: 'orange',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 16,
        marginBottom: 16,
        width: 200,
    },
    bold_text: {
        fontWeight: 'bold',
        fontSize: 16,
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
})