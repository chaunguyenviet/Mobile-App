import { Dimensions, StyleSheet, Text, View, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import urlVoucher from '../../api/api_voucher'
import urlProduct from '../../api/api_product'
import urlCategory from '../../api/api_category'
import urlUser from '../../api/api_user'
import Swiper from 'react-native-swiper'
import Three from '../../images/three.jpg'
import Two from '../../images/five.jpg'
import One from '../../images/one.jpg'
import AsyncStorage from '@react-native-async-storage/async-storage'
const WIDTH = Dimensions.get("window");
import {COLORS} from '../../constants'
const ProductScreen = (props) => {
  const { navigation } = props
  const [voucher, setVoucher] = useState([]);
  const [product,setProduct] = useState([])
  const [category,setCategory] = useState([])
  const [profile, setProfile] = useState({});
  useEffect(() =>{
    fetch(urlVoucher.ipv4 + 'voucher')
    .then((respone) =>respone.json())
    .then((json) =>setVoucher(json))
    .catch((err) => console.log(err))
  },[])
  useEffect(() =>{
    fetch(urlProduct.ipv4 + 'product')
    .then((respone) =>respone.json())
    .then((json) =>setProduct(json))
    .catch((err) => console.log(err))
  },[])
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
        console.log(json);
        if (json.success) {
          setProfile(json.data);
        }
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getProfile();
  }, []);
  const renderItem = ({ item }) => {
    return (
      <View style={styles.viewAvt}>
            <Image style={styles.img} source={{ uri: item.image }} resizeMode='stretch' />
            <View style={{marginLeft:10}}>
            <Text style={styles.textName}>{item.name}</Text>
            <View style={{width:70,borderRadius:5,borderColor:'orange',borderWidth:2,marginTop:40}}>
              <Text style={{color:'red',fontSize:15}}>Giảm Giá</Text>
            </View>
            </View>
            <View style={styles.btn_description}>
              <TouchableOpacity onPress={() =>navigation.navigate("VoucherScreen",{post:item})}>
              <Text style={{color:'white',fontSize:20}}>Chi tiết</Text>
              </TouchableOpacity>
            </View>
          </View>
    );
  };
  const renderProduct = ({item}) =>{
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ItemScreen", {
            post: item,
          })
        }
        style={styles.item}
      >
        <View>
          <Image
            style={{ width: "100%", height: 155,borderRadius:5}}
            source={{ uri: item.image }}
          />
          <Text style={styles.productName}>{item.name}</Text>
        </View>
        <View style={styles.wrapText}>
          <Text style={styles.price}>{item.price} đ</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.sliderContainer}>
        <Swiper
          autoplay
          horizontal={false}
          height={200}
          activeDotColor="#FF6347">
          <View style={styles.slide}>
            <Image
              source={One}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={Two}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={Three}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
        </Swiper>
      </View>
      <View style={styles.title}>
        <Text style={styles.text_title}>VOUCHER KHỦNG</Text>
      </View>
      <View style={{ flex: 1,padding:5 }}>
        <FlatList
          data={voucher}
          renderItem={renderItem}
          keyExtractor={item => `${item.id}`}
        />
      </View>
      <View style={styles.title}>
        <Text style={styles.text_title}>Product</Text>
      </View>
      <View style={{ flex: 1, paddingLeft: 5 }}>
        <FlatList
          data={product}
          showsHorizontalScrollIndicator={false}
          renderItem={renderProduct}
          keyExtractor={product => `${product.id}`}
          numColumns='2'
        />
      </View>
    </ScrollView>
  )
}
export default ProductScreen
const width = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6'
  },
  text_title: {
    fontSize: 23,
    color: 'white',
    fontWeight: 'bold',
    marginLeft:5
  },
  sliderContainer: {
    marginTop:10,
    height: 150,
    width: 380,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius:30
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  sliderImage: {
    height: '100%',
    width: 500,
    alignSelf: 'center',
    borderRadius: 8,
  },
  title: {
    flex: 1,
    marginLeft: 5,
    marginTop: 5,
    backgroundColor:'orange',
    width:'60%',
    borderBottomRightRadius:20,
    borderTopRightRadius:20
  },
  viewAvt: {
    flexDirection: "row",
    backgroundColor:'white',
    borderRadius: 4,
    height:140,
    marginVertical:5,
    borderColor:'#c2c2c2',
    borderWidth:2
  },
  img: {
    width: 140,
    height: 135,
    borderRadius:5,
    paddingRight:15
  },
  viewName: {
    justifyContent: "center",
    alignItems: "center",
  },
  textName: {
    fontSize: 24,
    fontWeight: "700",
    color:'red',
    marginVertical: 15,
  },
  btn_description:{
    marginLeft:10,
    marginTop:50,
    borderRadius:5,
    borderColor:'orange',
    borderWidth:1,
    height:30,
    backgroundColor:'orange'
  },
  productName: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "400",
    color:'black'
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 5,
    color:'red'
  },
  item: {
    flex: 1,
    width: "50%",
    backgroundColor:'white',
    padding: 5,
    margin: 5,
    shadowColor: 'orange',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent:"space-between",
    borderRadius:10,
    borderColor:'orange',
    borderWidth:1
  },
  wrapText: {
    justifyContent: "center",
  },
});