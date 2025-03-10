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
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext } from "react";
import Toast from "react-native-toast-message";
import ImageBack from "../../../assets/shop4.jpeg";
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
import Icon from "../../../assets/icon.png";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import axios from "axios";
import { s, vs, ms, mvs } from "react-native-size-matters";
import { GlobalContext } from "../../context/index";
import { Image as CompressorImage } from "react-native-compressor";
import ProBranch from "../../components/ProductBranch";
import { URL } from "../../Url";

const AddProducts = ({ navigation }) => {
  const getRandomInt = (min, max) => {
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const [ProductImg, setProductImg] = useState("");

  const [productName, setProductName] = useState("");

  const [Quantity, setQuantity] = useState("");

  const [productBranchs, setproductBranchs] = useState("");

  const [ActiveBut, setActiveBut] = useState(true)

  const { refreash, setRefreash, Branch, ProBranchs, setProBranchs } =useContext(GlobalContext);

  const handleSubmit = async () => {
    try {
      setActiveBut(false)
      const formData = new FormData();
      formData.append("image", {
        uri: ProductImg,
        type: "image/jpeg",
        name: "product_image.jpg",
      });
      formData.append("Name", productName);

      formData.append("Quantity", Quantity);

      formData.append("BranchName", ProBranchs);

      const response = await axios.post(`${URL}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status == 200) {
        const randomIntInRange = getRandomInt(1, 100);

        setRefreash(randomIntInRange);

        Toast.show({
          type: "success",
          // And I can pass any custom props I want
          text1: "Product Added successfully",
          visibilityTime: 2000, // 4 seconds
        });

        setProductImg("");
        setProductName("");
        setQuantity("");

        setActiveBut(true)

        navigation.navigate("Products");
      } else {
        alert("error Adding Product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const openCameraLib = async () => {
    console.log("PRESSS =====>>>");

    // Launch the image library
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1, // Set quality to maximum to get the best image for compression
    });

    if (result?.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      console.log("RESULT===>>", result);

      try {
        // Compress the selected image
        const compressedImageUri = await CompressorImage.compress(
          selectedImageUri,
          {
            compressionMethod: "manual", // You can choose 'auto' or 'manual'
            maxWidth: 1000, // Set your desired max width
            quality: 0.7, // Set the desired quality (0 to 1)
          }
        );

        // Update the state with the compressed image URI
        setProductImg(compressedImageUri);
        console.log("COMPRESSED IMAGE URI===>>", compressedImageUri);
      } catch (error) {
        console.error("Error compressing image: ", error);
      }
    }
  };

  return (
    <ImageBackground source={ImageBack} style={styles.container}>
      <View style={styles.overlay} />

      {/* Header Section */}
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            width: wp(30),
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Pressable
            onPress={() => {
              navigation.navigate("Products");
            }}
          >
            <Ionicons name="arrow-back-circle-sharp" size={30} color="white" />
          </Pressable>

          <Text style={{ fontSize: wp(4), color: "#ffd953", fontWeight: 400 }}>
            Will of God
          </Text>
        </View>

        <View style={{ width: wp(35) }}>
          <Text style={{ fontSize: wp(4), color: "#ffd953", fontWeight: 800 }}>
            Add Products
          </Text>
        </View>

        <View style={{ width: wp(17) }}>
          <Image source={Icon} style={{ width: "60%", height: "90%" }} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={{ width: "100%", flex: 1, alignItems: "center" }}>
          <ImageBackground
            style={{
              width: 200,
              height: 200,
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
                paddingHorizontal: s(10),
              }}
            >
              <Text
                style={{ fontSize: wp(4), color: "black", fontWeight: 800 }}
              >
                Product Name:
              </Text>
              <CustomInput
                value={productName}
                setvalue={setProductName}
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

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                paddingHorizontal: s(10),
              }}
            >
              <Text
                style={{ fontSize: wp(4), color: "black", fontWeight: 800 }}
              >
                Quantity:
              </Text>
              <CustomInput
                value={Quantity}
                setvalue={setQuantity}
                Radius={50}
                Background="#ffd953"
                placeholder="Enter Quantity"
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

            <ProBranch />
          </View>

          {/* Submit Button */}
         {
          ActiveBut && 

          <View>
          <CustomButton
            width={wp(45)}
            text="Submit"
            color="#ffa800"
            textcolor="white"
            borderR={10}
            items="center"
            padding="2%"
            marginT="4%"
            onPress={() => handleSubmit()}
            height={hp(7)}
            fontsize={24}
            weight={800}
          />
        </View>
         }
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
  },
  scrollView: {
    flex: 1,
    width: "100%",
    // backgroundColor: "red",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity here
  },
  header: {
    width: "100%",
    height: vs(30),
    // backgroundColor: "red",
    marginTop: hp(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  formPage: {
    flex: 1,
    backgroundColor: "white",
    width: "85%",
    height: hp(30),
    marginTop: hp(12),
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
});

export default AddProducts;
