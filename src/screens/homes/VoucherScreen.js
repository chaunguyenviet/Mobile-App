import { StyleSheet, Text, View,Image,TextInput } from 'react-native'
import React from 'react'
const VoucherScreen = ({route}) => {
  let post = route.params.post
  return (
    <View style={styles.container}>
            <View style={styles.viewVocher}>
                <Image style={styles.image} source={{uri : post.image}}/>
                <Text style={styles.textName}>{post.name}</Text>
                <Text style={styles.textCode}>code: {post.code}</Text>
            </View>
            <View style={styles.viewDes}>
                <Text style={styles.textDes}>{post.description}</Text>
            </View>
        </View>
  )
}

export default VoucherScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
    paddingHorizontal:5
},
viewVocher:{
    alignItems:"center",
    justifyContent:"center",
    borderRadius:8,
    borderWidth:1,
    borderColor:'orange',
    marginTop:10,
},
image:{
    width:"100%",
    height:200,
    borderRadius:5
},
textName:{
    fontSize:21,
    fontWeight:"600",
    marginTop:10
},
textCode:{
    fontSize:20,
    fontWeight:"bold",
    marginTop:10,
    textAlign:"center"
},
textDes:{
    fontSize:20,
    fontWeight:"bold",
},
viewDes:{
    flex:1,
    borderRadius:8,
    borderWidth:1,
    borderColor:'orange',
    marginTop:10,
    paddingHorizontal:10,
    paddingVertical:15,
    marginBottom:20
}
})