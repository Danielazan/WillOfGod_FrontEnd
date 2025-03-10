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
  ImageBackground,
} from "react-native";
import React,{useState,useContext} from "react";
import CustomInput from "../../components/CustomInput";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import icon from "../../../assets/icon.png";
import CustomButton from "../../components/CustomButton";
import store from "../../../assets/light store.jpg";
import Branch from "../../components/Branch";
import { GlobalContext } from "../../context/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { s, vs, ms, mvs } from 'react-native-size-matters';
import {URL} from "../../Url"

const Register = ({navigation}) => {

  const {
    Name,
        setName,
        BranchOffice, 
        setBranchOffice,
        Passowrd,
        setPassowrd,
        ComfirmPass,
        setComfirmPass,
  } = useContext(GlobalContext);

  const SignUp = async () => {

      try {
        const value = {
          Name:Name,
          Passowrd:Passowrd,
          BranchOffice:BranchOffice
        };

        if (Passowrd === ComfirmPass){
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem("MyDetailed", jsonValue);


          axios.post(`${URL}/api/users`, {
            username:Name,
            password:Passowrd,
            Branch:BranchOffice
          })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
        }
        else{
          alert("password did not match: Confirm Again")
        }

        setName("")
        setPassowrd("")
        setComfirmPass("")
        setBranchOffice("")

        
      } catch (e) {
        console.log("We have an error",e)
      }
  
    navigation.navigate("Login");
  };

  return (
    <ImageBackground source={store} style={styles.container}>
      <View style={styles.overlay} />
      <ScrollView style={styles.scrollView}>
        <View
          style={{
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Welcome Banner */}
          <View
            style={{
              width: "100%",
              // backgroundColor: "white",
              height: hp(22),
              alignItems: "center",
              justifyContent: "center",
              marginTop: hp(2),
            }}
          >
            <Image source={icon} />

            <Text style={{ fontSize: wp(5), fontWeight: 800, color: "white" }}>
              Welcome Back
            </Text>
            <Text
              style={{
                fontSize: wp(3),
                fontWeight: 400,
                marginBottom: hp(2),
                color: "white",
              }}
            >
              Please Enter your Login details below
            </Text>
          </View>

          {/* Form Page */}
          <View style={styles.formPage}>
            <CustomInput
              value={Name}
              setvalue={setName}
              Radius={10}
              Background="white"
              placeholder="Enter Your Name"
              width="50%"
              height={hp(8)}
              Hpadding="2%"
              bordercolor="white"
              Bwidth={2}
              borderButtom="red"
              //  TextBackground="black"
              TextHeight={hp(5)}
              fontsize={wp(3)}
              alignText="center"
            />

            <CustomInput
              value={Passowrd}
              setvalue={setPassowrd}
              Radius={10}
              Background="white"
              placeholder="Enter Your password"
              width="50%"
              height={hp(8)}
              secureTextEntry={true}
              Hpadding="2%"
              bordercolor="white"
              Bwidth={2}
              borderButtom="green"
              //  TextBackground="black"
              TextHeight={hp(5)}
              fontsize={wp(3)}
              alignText="center"
            />

            <CustomInput
              value={ComfirmPass}
              setvalue={setComfirmPass}
              Radius={10}
              Background="white"
              placeholder="Comfirm Your password"
              width="50%"
              height={hp(8)}
              secureTextEntry={true}
              Hpadding="2%"
              bordercolor="white"
              Bwidth={2}
              borderButtom="green"
              //  TextBackground="black"
              TextHeight={hp(5)}
              fontsize={wp(3)}
              alignText="center"
            />

            <Branch />
          </View>

          {/* Regiter Button */}

          <View
            style={{
              width: "80%",
              height: hp(10),
              // backgroundColor: "red",
              marginTop: hp(3),
              alignItems:"center",
              justifyContent:"center",
              flex:1
            }}
          >
            <CustomButton
                  width={wp(45)}
                  text="Register"
                  color="#ffa800"
                  textcolor="white"
                  borderR={10}
                  items="center"
                  padding="2%"
                  marginT="4%"
                  onPress={() => SignUp()}
                  height={hp(7)}
                  fontsize={24}
                  weight={800}
                />
    
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    blurRadius: 5,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity here
  },
  main: {
    backgroundColor: "#2b2f2b",
    borderRadius: 10,
    paddingLeft: 10,
    paddingVertical: 10,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    // backgroundColor: "red",
  },
  formPage: {
    flex: 1,
    backgroundColor: "white",
    width: s(270),
    height: mvs(303,0.6),
    marginTop: vs(46),
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Register;
