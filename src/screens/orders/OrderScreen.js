import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import urlCart from '../../api/api_cart';
import AsyncStorage from '@react-native-async-storage/async-storage'
// import Moment from 'react-moment';
const OrderSceen = ({ navigation }) => {
    let statuslist = [
        { _id: 0, name: 'Tất cả', code: "all" },
        { _id: 1, name: 'Đang xử lí', code: "dangxuli" },
        { _id: 2, name: 'Đang giao', code: "danggiao" },
        { _id: 3, name: 'Đã giao', code: "dagiao" },
        { _id: 4, name: 'Đã hủy', code: "dahuy" }
    ];
    const [orderList, setOrderList] = useState([]);
    const [dList, setDList] = useState([]);

    useEffect(() => {
        if (currentStatus == "all") {
            setDList(orderList);
            return;
        } else {
            setDList([
                ...orderList.filter(
                    (e) => e.status.toLowerCase() === code
                ),
            ]);
        }
    }, [currentStatus])
    useEffect(() => {
        async function getOrders() {
            let token = await AsyncStorage.getItem("t");
            fetch(urlCart.ipv4 + "cart/get", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            })
                .then((response) => response.json())
                .then((json) => {
                    console.log(json.list)
                    if (json.success) {
                        setOrderList(json.list);
                        setDList(json.list);
                    }
                })
                .catch((err) => console.log(err));
        }
        getOrders();
    }, [])

    // function getDate(date) {
    //     return moment(date).format("DD-MM-yyyy");
    // }

    function getStatus(code) {
        if (code == "dangxuli") {
            return 'Đang xử lí';
        }
        if (code == "danggiao") {
            return 'Đang giao'
        }
        if (code == "dagiao") {
            return 'Đã giao'
        }
        if (code == "dahuy") {
            return 'Đã hủy';
        }
    }

    const [currentStatus, setCurrentStatus] = useState(statuslist[0]._id);
    // useEffect
    function renderStatus({ item }) {
        return (
            <TouchableOpacity
                style={{ borderBottomWidth: 2, borderBottomColor: currentStatus == item._id ? 'white' : '#F55A00', }}
                onPress={() => {
                    setCurrentStatus(item.code);
                    console.log(currentStatus);
                }}
            >
                <Text style={[styles.bold_text, { marginVertical: 10, marginHorizontal: 7, color: item._id == currentStatus ? '#F55A00' : '' }]}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    function renderOrders({ item }) {
        return (
            <TouchableOpacity style={styles.item_order} onPress={() => navigation.navigate("OrderDetail", { id: item._id })}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.normal_text} >Đặt lúc:
                        {item.createdTime}
                    </Text>
                    <Text style={styles.bold_text}>{getStatus(item.status.toLowerCase())}</Text>
                </View>
                <FlatList
                    data={item.list}
                    keyExtractor={i => i._id}
                    renderItem={(product) => {
                        return <Text style={styles.normal_text}>{product.item.name}</Text>
                    }}
                />
                <Text style={[styles.bold_text, { color: 'red', textAlign: 'right' }]}>Tổng: {item.total} vnd</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={[styles.container, { backgroundColor: 'white', paddingLeft: 30, paddingRight: 10 }]}>
            <Text style={[styles.bold_text, { color: 'orange', marginVertical: 5, textAlign: 'center' }]}>Chọn để xem chi tiết</Text>
            <View>
                <FlatList
                    data={dList}
                    keyExtractor={item => item._id}
                    renderItem={renderOrders}
                />
            </View>
        </View>
    )
}

export default OrderSceen

const styles = StyleSheet.create({
    container: {
        flex: 3,
        flexDirection: 'column',
        paddingLeft: 40,
        paddingRight: 20,
    },
    bold_text: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    normal_text: {
        fontSize: 16,
    },
    item_order:{
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 8,
        borderRadius: 10,
        shadowColor: '#FC6D3F',
        shadowRadius: 9,
    },
})
