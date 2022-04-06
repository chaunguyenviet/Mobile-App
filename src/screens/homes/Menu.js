import { StyleSheet, Text, View,Dimensions,TextInput,TouchableOpacity,FlatList,Image } from 'react-native'
import React,{useState,useEffect} from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import urlCategory from '../../api/api_category'
import urlProduct from '../../api/api_product'
const WIDTH = Dimensions.get("window");

const Menu = (props) => {
  const {navigation} = props
  const [productFilter, setProductFilter] = useState(productList);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [currentCategory, setCurrentCategory] = useState();
  const [keyWord, setKeyWord] = useState([]);
 
  const setStatusFilter = (currentCategory) => {
    if (currentCategory !== "All") {
      setProductFilter([
        ...productList.filter(
          (e) => e.category.name === currentCategory
        ),
      ]);
    } else {
      setProductFilter(productList);
    }
    setCurrentCategory(currentCategory);
  };

  useEffect(() => {
    fetch(urlProduct.ipv4 + "category/all")
      .then((response) => response.json())
      .then((json) => {
        setProductFilter(json);
        setProductList(json);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch(urlCategory.ipv4 + "category")
      .then((response) => response.json())
      .then((json) => setCategoryList(json))
      .catch((err) => console.log(err));
  }, []);
  const search = async () => {
    if (keyWord == "") {
      return;
    }
    await fetch(urlProduct.ipv4 + "search/" + keyWord)
      .then((response) => response.json())
      .then((json) => setProductFilter(json))
      .catch((error) => console.error(error));
  };

  const renderItem = ({ item }) => {
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
            style={{ width: "100%", height: 150,borderRadius:5}}
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
    <View style={styles.container}>
      <View style={styles.viewPlace}>
        <View style={styles.viewIconPlace}>
          <FontAwesome name="map-marker-alt" size={24} color="orange" />
          <Text style={styles.textPlace}>Cong vien phan mem quang trung</Text>
          <TouchableOpacity  onPress={()=>navigation.navigate('CartScreen')}>
        <FontAwesome name="shopping-cart" size={24} color="orange" style={{marginLeft:60}}/>
      </TouchableOpacity>
        </View>
      </View>
      <View style={styles.viewSearch}>
        <TextInput
          style={styles.inputSearch}
          placeholder="Search...."
          onChangeText={(aaa) => {
            setKeyWord(aaa);
          }}
        />
        <FontAwesome
          onPress={() => search()}
          name="search"
          size={20}
          color="orange"
        />
      </View>
      <View style={{ marginBottom: 10 }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={categoryList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={[styles.viewItem]}>
              <TouchableOpacity
                style={[
                  currentCategory === item.name && styles.btnTabActive,
                ]}
                onPress={() => setStatusFilter(item.name)}
              >
                <Text
                  style={[
                    styles.title,
                    currentCategory === item.name &&
                      styles.textTabActive,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={productFilter}
          keyExtractor={(item) => `${item._id}`}
          renderItem={renderItem}
        />
      </View>
      </View>
  )
}

export default Menu

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#e6e6e6',
    paddingTop: 5,
  },
  viewPlace: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
  },
  viewIconPlace: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  viewIconNotifi: {
    justifyContent: "flex-end",
  },
  textPlace: {
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  textTabActive: {
    color: 'orange',
    fontWeight: "700",
  },
  btnTabActive: {
    width: "100%",
    borderBottomWidth: 2,
    borderColor: 'orange',
    alignItems: "center",
    paddingBottom: 5,
  },
  viewItem: {
    width: WIDTH.width / 4.5,
    alignItems: "center",
  },
  viewSearch: {
    flexDirection: "row",
    alignItems: "center",
    height:45,
    paddingRight: 5,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
  },
  inputSearch: {
    flex: 1,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
  },
  wrapText: {
    justifyContent: "center",
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
    borderRadius:10
  },
  invisible: {
    backgroundColor: "transparent",
  },
  viewCart: {
    width: 55,
    height: 55,
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius:30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
})