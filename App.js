import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import CartScreen from "./src/screens/orders/CartScreen";
import ItemScreen from "./src/screens/orders/ItemScreen";
import Register from "./src/screens/account/Register";
import OrderScreen from "./src/screens/orders/OrderScreen";
import OrderDetail from "./src/screens/orders/OrderDetail";
import { COLORS } from "./src/constants";
import ChangePassword from "./src/screens/account/ChangePassword";
import OtpScreen from "./src/screens/account/OtpScreen";
import ForgotPassword from './src/screens/account/ForgotPassword';
import Splash from './src/screens/login/Splash';
import MyTabs from './src/navigation/BottomTab';
import UpdateProfile from "./src/screens/profile/UpdateProfile";
import VoucherScreen from "./src/screens/homes/VoucherScreen";
import Login from "./src/screens/login/SignIn";



const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Otp" component={OtpScreen}
          options={{
            headerTitle: "Xác thực OTP",
            headerTintColor: 'white',
            headerStyle: { backgroundColor: 'orange' },
            headerTitleStyle: { fontWeight: 'bold', fontSize: 20, color: 'white' }
          }} />
        <Stack.Screen name="OrderDetail" component={OrderDetail}
          options={{
            headerTitle: "Chi tiết đơn hàng",
            headerTintColor: 'white',
            headerStyle: { backgroundColor: 'orange'},
            headerTitleStyle: { fontWeight: 'bold', fontSize: 20, color: 'white' }
          }} />
        <Stack.Screen name="ForgotP" component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CP" component={ChangePassword}
          options={{
            headerTitle: "Đổi mật khẩu",
            headerTintColor: 'white',
            headerStyle: { backgroundColor: 'orange'},
            headerTitleStyle: { fontWeight: 'bold', fontSize: 20, color: 'white' }
          }} />
        <Stack.Screen name="Orders" component={OrderScreen}
          options={{
            headerTitle: "Đơn Hàng",
            headerTintColor: 'white',
            headerStyle: { backgroundColor: 'orange' },
            headerTitleStyle: { fontWeight: 'bold', fontSize: 20, color: 'white' }
          }}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="SplashScreen"
          component={Splash}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Register"
          component={Register}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="MyTabs"
          component={MyTabs}
        />
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{
            headerTitle: "Thanh toán",
            headerTintColor: "white",
            headerStyle: { backgroundColor: 'orange'},
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "white",
            },
          }}
        />
        <Stack.Screen
          name="ItemScreen"
          component={ItemScreen}
          options={{
            headerTitle: "Sản Phẩm",
            headerTintColor: "white",
            headerStyle: { backgroundColor: 'orange'},
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "white",
            },
          }}
        />
        <Stack.Screen
          name="UpdateProfileScreen"
          component={UpdateProfile}
          options={{
            headerTitle: "Cập Nhập Thông Tin",
            headerTintColor: "white",
            headerStyle: { backgroundColor: 'orange' },
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "white",
            },
          }}
        />
        <Stack.Screen
          name="VoucherScreen"
          component={VoucherScreen}
          options={{
            headerTitle: "Ưu đãi",
            headerTintColor: "white",
            headerStyle: { backgroundColor: 'orange' },
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "white",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
