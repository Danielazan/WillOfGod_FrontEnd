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
import React,{useState} from "react";
import CustomInput from "../../components/CustomInput";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
    Feather,
    FontAwesome,
    Ionicons,
    AntDesign,
    Entypo,
    MaterialIcons,
  } from "@expo/vector-icons";
import CustomButton from "../../components/CustomButton";
import Icon from "../../../assets/icon.png"

const Editproduct = () => {
    const openCameraLib = async () => {
        console.log("PRESSS =====>>>");
        const result = await launchImageLibrary();
        setImage(result?.assets[0]?.uri);
        console.log("RESULT===>>", result);
      };

      const [ProductImg, setProductImg] = useState("")

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", flex: 1, alignItems: "center" }}>
        <ImageBackground
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            backgroundColor: "#ffd953",
            marginTop: 12,
            position: "relative",
          }}
          source={ProductImg ? { uri: ProductImg } : Icon}
        >
          <Entypo
            name="camera"
            size={27}
            color="white"
            style={{ position: "absolute", bottom: 10, right: 2 }}
            onPress={() => openCameraLib()}
          />
        </ImageBackground>

        {/* Forms to fill */}
        <View style={styles.formPage}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              width: "100%",
              height:"100%"
            }}
          >
            
            <CustomInput
              // value="UserName"
              Radius={50}
              Background="#ffd953"
              placeholder="Enter Product Name or Number"
              width="60%"
              TRadius={40}
              height={hp(5)}
              Hpadding="2%"
              Bwidth={2}
              TextHeight={hp(5)}
              fontsize={wp(3)}
              alignText="center"
            />
          </View>

        </View>

        {/* Submit Button */}
        <View>
          <CustomButton
            width={wp(35)}
            text="Submit"
            color="#ffa800"
            textcolor="white"
            borderR={10}
            items="center"
            padding="2%"
            marginT="4%"
            onPress={() => Login()}
            height={hp(4)}
            fontsize={24}
            weight={800}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
  },

  formPage: {
    flex: 1,
    backgroundColor: "white",
    width: "80%",
    height: "100%",
    marginTop: hp(6),
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius:20,
    flexDirection:"column"
  },
});

export default Editproduct;
