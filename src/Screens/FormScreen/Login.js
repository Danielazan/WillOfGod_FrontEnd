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
import React, { useState, useContext } from "react";
import CustomInput from "../../components/CustomInput";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import icon from "../../../assets/icon.png";
import CustomButton from "../../components/CustomButton";
import store from "../../../assets/light store.jpg";
import { GlobalContext } from "../../context/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { s, vs, ms, mvs } from "react-native-size-matters";
import { URL } from "../../Url";

const Login = ({ navigation }) => {
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

  // http://13.53.88.231:8000

  const HandleLogin = () => {
    if (Name == "Admin" && Passowrd == "LazanWill") {
      setName("Admin");
      navigation.navigate("Home");
    } else {
      axios
        .get(`${URL}/api/users/${Name}`)
        .then((response) => {
          // Assuming the response contains user data
          const userData = response.data.result;

          // Check if userData is not empty and contains the password
          const value = {
            Name: userData.username,
            Passowrd: userData.Password,
            BranchOffice: userData.Branch,
          };

          if (userData && userData.password) {
            if (userData.password === Passowrd) {
              alert("Login successful!");
              const jsonValue = JSON.stringify(value);
              AsyncStorage.setItem("MyDetailed", jsonValue);

              navigation.navigate("Home");
            } else {
              alert("Incorrect password. Please try again.");
            }
          } else {
            alert("User not found.");
            navigation.navigate("Register");
          }
          console.log(userData.password);
        })
        .catch((error) => {
          console.error("Error fetching data:", error.message);
          alert("User Does not Exit, Please Register");
          navigation.navigate("SignUp");
        });
    }

    // console.log(Name, Passowrd);
  };

  const handleReg = () => {
    navigation.navigate("SignUp");
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
              marginTop: vs(20),
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
              placeholder="Enter Your UserName"
              width="50%"
              
              height="32%"
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
              secureTextEntry={true}
              height="32%"
              Hpadding="2%"
              bordercolor="white"
              Bwidth={2}
              borderButtom="green"
              //  TextBackground="black"
              TextHeight={hp(5)}
              fontsize={wp(3)}
              alignText="center"
            />
          </View>

          {/* Login Button */}
          <View>
            <CustomButton
              width={wp(45)}
              text="Login"
              color="#ffa800"
              textcolor="white"
              borderR={10}
              items="center"
              padding="2%"
              marginT="4%"
              onPress={() => HandleLogin()}
              height={hp(7)}
              fontsize={24}
              weight={800}
            />
          </View>

          {/* Redrict to login */}

          <View
            style={{
              flex: 1,
              width: "100%",
              height: hp(4),
              backgroundColor: "black",
              marginVertical: hp(15),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "80%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Text style={{ fontSize: wp(3), color: "red", fontWeight: 400 }}>
                Don't have An Account
              </Text>

              <TouchableOpacity onPress={() => handleReg()}>
                <Text
                  style={{ fontSize: wp(3), color: "green", fontWeight: 800 }}
                >
                  Register?
                </Text>
              </TouchableOpacity>
            </View>
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
    width: s(250),
    height: hp(23),
    marginTop: hp(16),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Login;
