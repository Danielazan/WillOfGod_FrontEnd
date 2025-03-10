import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  NativeModules,
  AppState,
  ScrollView,
} from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import Cards from "../../components/HomeCards";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import Watch from "../../../assets/watch.png";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { GlobalContext } from "../../context/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import Icon from "../../../assets/icon.png"
import { s, vs, ms, mvs } from 'react-native-size-matters';



const Index = ({ navigation }) => {

  const handleNavigation = (Location) => {
    
    console.log(Location)
    navigation.navigate(Location);
  };

  const {Name, refreash, setRefreash, Branch, ProBranchs, setProBranchs } =useContext(GlobalContext);
  

  const [DATA, setData] = useState([
    {
      icon: <Ionicons name="arrow-back-circle-sharp" size={30} color="black" />,
      text1: "Sales",
      text2: "5000 Sales made",
    },
   {
      icon: <Ionicons name="arrow-back-circle-sharp" size={30} color="black" />,
      text1: "Products",
      text2: "100000 Total Products",
    },
    {
      icon: <Ionicons name="arrow-back-circle-sharp" size={30} color="black" />,
      text1: "Customers",
      text2: "View Customers Details",
    },
    {
      icon: <Ionicons name="arrow-back-circle-sharp" size={30} color="black" />,
      text1: "Invocies",
      text2: "Check All Reports",
    },
    {
      icon: <Ionicons name="arrow-back-circle-sharp" size={30} color="black" />,
      text1: "Branchs",
      text2: "Add Or Remove Branchs",
    },
    {
      icon: <Ionicons name="arrow-back-circle-sharp" size={30} color="black" />,
      text1: "Users",
      text2: "Amber Light",
    },
  ]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          // backgroundColor: '#f9c2ff',
          padding: 0,
          flex: 1,
          alignItems: "center",
          borderRadius: 5,
          width: "100%",
        }}

        onPress={()=>handleNavigation(item.text1)}
      >
       { <Cards
          icon={item.icon}
          text1={item.text1}
          text2={item.text2}
          MarginBotton={0}
        />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.BannerMain}>
        <TouchableOpacity style={styles.Back}>
          <Ionicons name="arrow-back-circle-sharp" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.bannerCon}>
          <View style={styles.bannerCon1}>
            <Text style={{ fontSize: 32, fontWeight: 800 }}>
              Will Of God
            </Text>

            <Text style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>
              Lighting Store
            </Text>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                // backgroundColor: "white",
                height: "20%",
                flex: 1,
                gap: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: 600 }}> All Kinds</Text>

              <Text style={{ fontSize: 14, fontWeight: 600 }}> Lights Needed</Text>

              <Text style={{ fontSize: 14, fontWeight: 400 }}> </Text>
            </View>
          </View>

          <View style={styles.bannerCon2}>
            <Image
              source={Icon}
              style={{ width: ms(130,0.3), height:mvs(135), marginRight:s(10) }}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.flash}>
        <FlashList
          data={DATA}
          renderItem={renderItem}
          estimatedItemSize={200}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1f1b",
    // alignItems: "center",
    // justifyContent: "center",
    width: "100%",
  },
  container2: {
    flex: 1,
    // backgroundColor: "black",
    width: "100%",
  },

  flash: {
    width: "100%",
    backgroundColor: "#1b1f1b",
    height: "80%",
    // alignItems:"center",
  },
  BannerMain: {
    backgroundColor: "#fea500",
    width: "100%",
    height: hp(35),
    marginBottom:20
  },
  Back: {
    width: "100%",
    height: "20%",
    // backgroundColor:"green",
    marginTop: 30,
    alignItems: "baseline",
    justifyContent: "flex-end",
  },
  bannerCon: {
    width: "100%",
    height: hp(30),
    // backgroundColor: "green",
    flexDirection: "row",
  },
  bannerCon1: {
    width: "70%",
    height: "100%",
    // backgroundColor: "blue",
    paddingLeft: 5,
  },
  bannerCon2: {
    width: s(35),
    height:vs(150),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor:'red'
  },
});

export default Index;
