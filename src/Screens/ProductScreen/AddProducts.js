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

  const [ActiveBut, setActiveBut] = useState(true);

  const { refreash, setRefreash, Branch, ProBranchs, setProBranchs } =
    useContext(GlobalContext);

  const handleSubmit = async () => {
    try {
      setActiveBut(false);
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

        setActiveBut(true);

        navigation.navigate("Products");
      } else {
        alert("error Adding Product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // _____

  // const handleSubmit = async () => {
  //   console.log("Tiggereed")
  //   try {
  //     setActiveBut(false);
     

  //     // Validation: check that all required product fields are provided
  //     if (!productName || !Quantity || !ProBranchs) {
  //       throw new Error("All product fields are required");
  //     }

  //   //   // Post the product data to the API

    
  //   const response = await axios.post(`${URL}/api/products`, {
  //     Name: productName,
  //     Quantity: Quantity,
  //     BranchName: ProBranchs || "New Haven",
  //   });
  //   console.log("Response:", response);

  //     if (response.data.success) {
  //       // Update refresh state with a random integer (assuming randomIntInRange is a function or value)
  //       const actualImageName = ProductImg.split('/').pop(7);
  //       const result = await uploadInChunks(
  //         ProductImg, 
  //         `${actualImageName}`, 
  //         response.data.productId   // attach productId
  //       );
  //       const randomIntInRange = getRandomInt(1, 100);
  //       setRefreash(randomIntInRange);

  //       // Show success toast
  //       Toast.show({
  //         type: "success",
  //         text1: "Product Added successfully",
  //         visibilityTime: 2000,
  //       });

  //       // // Clear product fields and reset button state
  //       setProductImg("");
  //       setProductName("");
  //       setQuantity("");

  //       setActiveBut(true);

  //       // Optionally navigate to Products screen
  //       navigation.navigate("Products");

  //       return {
  //         success: true,
  //         productId: response.data.productId,
  //         message: response.data.message,
  //       };
  //     } 
  //     else {
  //       return {
  //         success: false,
  //         message: response.data.error || "Failed to add product",
  //       };
  //     }
  //   } catch (error) {
  //     setActiveBut(true); // Re-enable button on error
  //       console.error("Request failed:", error);
  //     return {
  //       success: false,
  //       message: error.response?.data?.error || error.message || "Server error",
  //     };
  //   }

  // };

  const compressToTargetSize = async (uri, targetKB = 72) => {
    try {
      let quality = 0.8; // start with 80%
      let maxWidth = 1000; // start with 1000px width
      let compressedUri = uri;

      while (quality > 0.1 && maxWidth > 200) {
        compressedUri = await CompressorImage.compress(uri, {
          compressionMethod: "manual",
          quality: quality,
          maxWidth: maxWidth,
        });

        // get size in KB
        const response = await fetch(compressedUri);
        const blob = await response.blob();
        const fileSizeKB = blob.size / 1024;

        console.log(
          `Compressed size: ${fileSizeKB.toFixed(
            2
          )}KB at quality ${quality}, maxWidth ${maxWidth}`
        );

        if (fileSizeKB <= targetKB) {
          return compressedUri;
        }

        // If still too large, first reduce quality, then reduce dimensions
        if (quality > 0.2) {
          quality -= 0.1;
        } else {
          maxWidth -= 200; // shrink dimensions gradually
        }
      }

      return compressedUri; // return best result
    } catch (error) {
      console.error("Compression error:", error);
      return uri;
    }
  };

  const openCameraLib = async () => {
    console.log("PRESSS =====>>>");

    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1, // pick best quality, we will compress later
    });

    if (result?.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      console.log("RESULT===>>", result);

      try {
        // compress to ~72KB
        const compressedImageUri = await compressToTargetSize(
          selectedImageUri,
          72
        );

        setProductImg(compressedImageUri);
        console.log("Final Compressed URI===>>", compressedImageUri);
      } catch (error) {
        console.error("Error compressing image: ", error);
      }
    }
  };

  const uploadInChunks = async (fileUri, fileName, productId) => {
    try {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      // Fetch the file from local URI
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const fileSize = blob.size;
      const chunkSize = 20 * 1024; // 20KB
      const totalChunks = Math.ceil(fileSize / chunkSize);
  
      const fileId = Date.now().toString(); // unique ID for this file
  
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, fileSize);
        const chunk = blob.slice(start, end);
  
        // Convert chunk → base64
        const base64Chunk = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve(reader.result.split(",")[1]); // strip "data:*/*;base64,"
          reader.onerror = reject;
          reader.readAsDataURL(chunk);
        });
  
        // Send JSON (not FormData)
        await axios.post(`${URL}/api/uploadchunk`, {
          chunk: base64Chunk,
          fileId,
          chunkNumber: i + 1,
          totalChunks,
          fileName,
          productId,
        });
  
        console.log(`✅ Uploaded chunk ${i + 1}/${totalChunks}`);
        if (i < totalChunks - 1) {
    await delay(5000);
  }
      }
  
      // Tell server to assemble chunks
      const { data } = await axios.post(`${URL}/api/assemble`, {
        fileId,
        totalChunks,
        fileName,
        productId,
      });
  
      console.log("🎉 File upload complete!", data);
      return data;
    } catch (error) {
      console.error("❌ Chunk upload error:", error);
      throw error;
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
          {ActiveBut ? (
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
          ) : (
            <View style={{ marginTop: hp(4), alignItems: "center" }}>
              <ActivityIndicator size="large" color="#ffa800" />
              <Text style={{ color: "#ffa800", marginTop: 8 }}>
                Resizing Pic...
              </Text>
            </View>
          )}
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
