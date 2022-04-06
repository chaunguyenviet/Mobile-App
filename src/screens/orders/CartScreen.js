import { ScrollView, StyleSheet, Text, View,Alert,Modal,TouchableOpacity,Image,Pressable,TextInput } from 'react-native'
import React,{useState,useEffect} from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import urlUser from '../../api/api_user'
import urlVoucher from '../../api/api_voucher'
import urlCart from '../../api/api_cart'
import urlProduct from '../../api/api_product'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SwipeListView } from 'react-native-swipe-list-view'
const CartScreen = (props) => {
  const {navigation} = props
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [cart, setCart] = useState([]);
  const [isChange, setIsChange] = useState(true);
  const [profile, setProfile] = useState({});
  const [total, setTotal] = useState(0);
  const [voucher, setVoucher] = useState("");
  const [value, setValue] = useState(0);
  const [superTotal, setSuperTotal] = useState(0);
  const [note, setNote] = useState("");
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
    getProfile();
  }, []);

  const up = (cart_id) => {
    updateQuantity(cart_id, true);
  };

  const down = (cart_id) => {
    updateQuantity(cart_id, false);
  };
  const saveVoucher = (code) => {
    fetch(urlVoucher.ipv4 + "get-voucher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ code: code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setValue(data.value);
          setShowVoucher(false);
        } else {
          console.log(data.msg);
          Alert.alert(data.msg);
        }
      })
      .catch((err) => console.log(err));
  };
  const updateQuantity = async (id, t) => {
    fetch(urlCart.ipv4 + "cart/change-quantity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + (await AsyncStorage.getItem("t")),
      },
      body: JSON.stringify({ t: t, id: id }),
    })
      .then((res) => setIsChange(!isChange))
      .catch((err) => console.log(err));
  };
  const renderItem = ({ item }) => {
    return (
      <Pressable>
        <View style={styles.item}>
          <Image
            style={{ width: 50, height: 50, borderRadius: 5 }}
            source={{ uri: item.image }}
          />
          <View style={styles.wrapText}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.price}>đ {item.price}</Text>
          </View>
          <View
            style={{
              justifyContent: "flex-end",
              flex: 1,
              alignItems: "flex-end",
            }}
          >
           
          </View>

          <View style={styles.upDown}>
          <TouchableOpacity onPress={() => down(item._id)}>
              <Text style={styles.textUpDown}>-</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: "400" }}>
              {item.quantity}
            </Text>
            <TouchableOpacity onPress={() => up(item._id)}>
              <Text style={styles.textUpDown}>+</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Pressable>
    );
  };
  const getTotal = (cart) => {
    let list = [];
    cart.forEach((e) => {
      let c = { id: e.id, quantity: e.quantity };
      list.push(c);
    });
    fetch(urlProduct.ipv4 + "get-total", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ list: list }),
    })
      .then((response) => response.json())
      .then((json) => setTotal(json.total))
      .catch((err) => console.log(err));
  };
  const getData = async () => {
    fetch(urlCart.ipv4 + "cart/get", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + (await AsyncStorage.getItem("t")),
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setCart(json);
        getTotal(json);
      })
      .catch((err) => console.log(err));
  };
  const deleteData = async () => {
    fetch(urlCart.ipv4 + "delete/:id", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + (await AsyncStorage.getItem("t")),
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setCart(json);
      })
      .catch((err) => console.log(err));
  };
  const checkOut = async (products, note, total, value, superTotal) => {
    let token = await AsyncStorage.getItem("t");
    let list = products.map((e) => {
      delete e.image;
      return e;
    });
    fetch(urlCart.ipv4 + "create-order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        products: list,
        note: note,
        total: total,
        value: value,
        superTotal: superTotal,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.status) {
          console.log("Thanh cong");
          navigation.goBack();
        }
      })
      .catch((err) => console.log(err));
  };
  const deleteCart = async (products, total, value, superTotal) => {
    let token = await AsyncStorage.getItem("t");
    let list = products.map((e) => {
      delete e.image;
      return e;
    });
    fetch(urlCart.ipv4 + "delete", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        products: list,
        total: total,
        value: value,
        superTotal: superTotal,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.status) {
          console.log("Thanh cong");
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getData();
  }, [isChange]);
  useEffect(() => {
    setSuperTotal(total - value > 0 ? total - value : 0);
  }, [total, value]);
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.viewTT}>
          <View style={styles.viewIcon}>
            <FontAwesome name="map-marker-alt" size={20} color="orange" />
            <Text style={styles.titles}>{profile ? profile.address : ""}</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.viewIcon}>
            <FontAwesome name="user" size={20} color="orange" />
            <View>
              <Text style={styles.title}>{profile ? profile.name : ""}</Text>
              <Text style={styles.titles}>{profile ? profile.phone : ""}</Text>
            </View>
          </View>
          <View style={styles.line} />
        </View>
        <View style={styles.viewList}>
          <View style={styles.viewAdd}>
            <Text style={styles.text}>Giỏ hàng</Text>
            <TouchableOpacity
              style={styles.btnAdd}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.textAdd}>Thêm</Text>
            </TouchableOpacity>
          </View>
          <SwipeListView
            showsVerticalScrollIndicator={false}
            data={cart}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            renderHiddenItem={(data,rowMap) =>(
              <View style={{justifyContent:'center',margin:5}}>
                <TouchableOpacity style={styles.btn_delete}
              onPress={() =>deleteCart(cart, total, value, superTotal)}
            >
              <Text style={{color:'white',fontSize:20,top:15}}>Delete</Text>
            </TouchableOpacity>
                </View>
            )}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </View>
        <View style={styles.viewTotal}>
          <Text style={styles.textVAT}>
            Giá bán đã bao gồm 7% VAT
          </Text>
          <View style={styles.line} />
          <TouchableOpacity
            style={styles.viewVoucher}
            onPress={() => setShowVoucher(true)}
          >
            <FontAwesome name="money-check-alt" size={24} color="orange" />
            <Text style={styles.textVoucher}>Nhập mã</Text>
          </TouchableOpacity>
          <View style={styles.CheckOut1}>
            <View style={{ flex: 1 }}>
              <Text style={styles.textCheckOut}>Tổng tiền hàng</Text>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <Text style={styles.textCheckOut}>{total} đ</Text>
            </View>
          </View>
          <View style={styles.CheckOut1}>
            <View style={{ flex: 1, marginTop: 10 }}>
              <Text style={styles.textCheckOut}>Giảm giá </Text>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <Text style={styles.textCheckOut}>- {value} đ</Text>
            </View>
          </View>

          <View style={styles.CheckOut1}>
            <View style={{ flex: 1, marginTop: 10 }}>
              <Text style={styles.textCheckOutTotal}>Tổng thanh toán</Text>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <Text style={styles.textCheckOutTotal2}>{superTotal} đ</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {cart.length > 0 ? 
      <View style={styles.checkOut}
      >
        <Pressable
          style={styles.btnCheckout}
          onPress={() => setShowCheckOut(true)}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: 'white',
              fontSize: 16,
            }}
          >
            Đặt hàng
          </Text>
        </Pressable>
      </View> : null}
      
      {/* ModalCheckOut */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCheckOut}
        onRequestClose={() => setShowCheckOut(!showCheckOut)}>
        <View style={styles.viewDialog}>
        <View style={styles.modal}>
          <Text style={styles.textUD}>Xác nhận đặt hàng</Text>
          <View style={styles.viewBtn}>
            <TouchableOpacity
              style={[styles.btn, {
                backgroundColor: 'white',
                borderWidth: 0.8,
                borderColor: 'orange',
                borderRadius: 5,
              }]}
              onPress={() => {
                setShowCheckOut(!showCheckOut)}}
            >
              <Text style={[styles.titles,{fontWeight:'bold',color:'orange',marginLeft:0}]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => checkOut(cart, note, total, value, superTotal)}
            >
              <Text style={[styles.titles,{fontWeight:'bold',color:'white',marginLeft:0}]}>Xác Nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showVoucher}
        onRequestClose={() => {
          setShowVoucher(!showVoucher)}}>
        <View style={styles.viewDialog}>
          <View style={styles.modal}>
            <Text style={styles.textUD}>Ưu đãi</Text>
            <TextInput
              style={styles.inputCode}
              placeholder="code voucher"
              onChangeText={(e) => setVoucher(e)}
            />
            <View style={styles.viewBtn}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: 'white',
                    borderWidth: 0.8,
                    borderColor: 'orange',
                    borderRadius: 5,
                  },
                ]}
                onPress={() => setShowVoucher(!showVoucher)}
              >
                <Text
                  style={[styles.bold_text, { color:'orange' }]}
                >
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => saveVoucher(voucher)}
              >
                <Text style={[styles.bold_text, { color:'white' }]}>
                  Xác Nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  textUpDown: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    textAlign: "center",
    borderColor:'orange',
    margin: 5,
  },
  upDown: {
    marginLeft: 10,
    flexDirection:'row'
  },
  btnCheckout: {
    width: "100%",
    height: 45,
    backgroundColor: 'orange',
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  textCheckOut: {
    fontSize: 16,
    color: "#696969",
  },
  textCheckOutTotal: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  textCheckOutTotal2: {
    fontSize: 22,
    color:'orange',
    fontWeight: "bold",
  },
  CheckOut1: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor:'white',
    paddingRight: 20,
    paddingLeft: 20,
  },
  checkOut: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  item: {
    backgroundColor:'white',
    padding: 10,
    borderBottomWidth: 0.8,
    borderColor: 'orange',
    flexDirection: "row",
    alignItems: "center",
  },
  productName: {
    width: "100%",
    fontSize: 16,
    color:'black'
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color:'red'
  },
  wrapText: {
    marginLeft: 10,
    // marginTop: 16,
    justifyContent: "center",
  },
  viewTT: {
    borderWidth: 0.5,
    borderColor: 'orange',
    borderRadius: 8,
    marginTop: 20,
  },
  viewIcon: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  titles: {
    fontSize: 16,
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 15,
    alignItems:'center',
    justifyContent  :'center'
  },
  line: {
    height: 1,
    width: "100%",
    backgroundColor:'orange',
    alignSelf: "center",
    opacity: 0.8,
  },
  viewList: {
    borderWidth: 0.5,
    borderColor: 'orange',
    borderRadius: 8,
    marginTop: 20,
  },
  viewAdd: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor:'orange',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: "700",
    color:'white',
  },
  textAdd: {
    fontSize: 16,
    fontWeight: "700",
    color: 'white',
  },
  btnAdd: {
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    right: 20,
  },
  viewTotal: {
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor:'orange',
    borderRadius: 8,
    marginTop: 20,
  },
  textVAT: {
    fontSize: 16,
    color: "#696969",
    fontWeight: "400",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  viewVoucher: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 10,
    borderBottomWidth: 0.8,
    borderColor:'orange',
    paddingHorizontal: 20,
  },
  textVoucher: {
    fontSize: 16,
    fontWeight: "600",
    color: 'grey',
    marginLeft: 10,
  },
  viewDialog: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modal: {
    width: "100%",
    backgroundColor:'white',
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  textUD: {
    fontSize: 18,
    fontWeight: "700",
    width: "100%",
    padding: 10,
    backgroundColor: 'white',
    textAlign: "center",
    color:'orange',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  inputCode: {
    borderRadius: 10,
    borderColor:'orange',
    padding: 10,
    borderWidth:1
  },
  viewBtn: {
    flexDirection: "row",
    marginTop:5
  },
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    backgroundColor: 'orange',
    borderRadius: 3,
    padding: 10,
  },
  btn_delete:{
    backgroundColor:'#ff6347',
    height:60,
    width:60,
    margin:5,
    borderRadius:10
  },
  bold_text: {
    fontWeight: 'bold',
    fontSize: 16,
  }
})