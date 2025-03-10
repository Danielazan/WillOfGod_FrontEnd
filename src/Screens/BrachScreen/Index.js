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
  Animated,
  ScrollView,
  TextInput,
  ImageBackground,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GlobalContext } from "../../context/index";
import Toast from "react-native-toast-message";
import { FlashList } from "@shopify/flash-list";
import {
  Feather,
  FontAwesome,
  Ionicons,
  AntDesign,
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { SearchBar } from "react-native-screens";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Logo from "../../../assets/icon.png";
import pdf from "../../../assets/pdfIcon.png";
import Excel from "../../../assets/excelcon.png";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import Icon from "../../../assets/icon.png";
import axios from "axios";
import { s, vs, ms, mvs } from "react-native-size-matters";
import filter from "lodash.filter";
import { Image as CompressorImage } from "react-native-compressor";
import { URL } from "../../Url";

const Index = ({ navigation }) => {
  const [isFocused, setIsFocused] = useState(false);

  const [products, setProducts] = useState([]);

  const [Model, setModel] = useState(false);

  const [productName, setProductName] = useState("Light");

  const [searchQuery, setSearchQuery] = useState("");

  const [editId, setEditId] = useState("");

  const [inputValues, setInputValues] = useState("");

  const [Loca, setLoca] = useState("")

  const { DATA, setData, refreash, setRefreash, EditQty, setEditQty } =
    useContext(GlobalContext);

    const [BraName, setBraName] = useState("")

  const [ProductImg, setProductImg] = useState("");

  const [fullDate, setFullDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [editImage, setEditImage] = useState(null);

  const [showAdd, setShowAdd] = useState(false);

  const opacityAnimation = useRef(new Animated.Value(0)).current; // Start with opacity 0


  const getRandomInt = (min, max) => {
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min)) + min;
  };
  const fadeIn = () => {
    Animated.timing(opacityAnimation, {
      toValue: 1, // Target opacity
      duration: 1000, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(opacityAnimation, {
      toValue: 0, // Target opacity
      duration: 1000, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };


  const AddProducts = () => {
    navigation.navigate("AddBranchs");
  };

  const fetchBranchs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${URL}/api/branch`);
      // Reverse the products array
      const reversedProducts = response.data.reverse();

      setProducts(reversedProducts);

      setFullDate(reversedProducts);
      console.log("Products:", reversedProducts);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = (productId, productName) => {
    new Promise((resolve, reject) => {
      Alert.alert(`Deleting  ${productName}`, "", [
        { text: "Cancel", onPress: () => reject("Call rejected") },
        {
          text: "Continue",
          onPress: () =>
            resolve(
              axios.delete(`${URL}/api/branch/${productId}`).then((res) => {
                console.log(res);
                fetchBranchs();
                Toast.show({
                  type: "success",
                  // And I can pass any custom props I want
                  text1: "Product Deleted Successfully",
                  visibilityTime: 9000, // 4 seconds
                });
              })
            ),
        },
      ]);
    });
    // Make the DELETE request

    // Handle successful response
    // console.log('Product deleted successfully:', response);
  };

  useEffect(() => {
    fetchBranchs();
  }, [refreash]);

  const ActiveItem = (item, index, type, act) => {
    try {
      const NewData = products.map((e, idx) => {
        if (item.id === e.id && type == "action" && act == "open") {
          return {
            ...e,
            selected: true,
          };
        }

        if (item.id === e.id && type == "All" && act == "close") {
          return {
            ...e,
            selected: false,
            QuantityO: false,
            ImageChange: false,
          };
        }

        if (item.id === e.id && type == "addQ" && act == "open") {
          return {
            ...e,
            selected: false,
            QuantityO: true,
          };
        }

        if (item.id === e.id && type == "Edit Image" && act == "open") {
          return {
            ...e,
            selected: false,
            ImageChange: true,
          };
        }

        return {
          ...e,
          selected: false,
        };
      });

      setProducts(NewData);
      console.log(item.id);
    } catch (error) {
      console.error(
        "An error occurred while updating the active item:",
        error.message
      );

      return {
        selected: false,
      };
    }
  };

  const handleInputChange = (item, index) => {
    setShowAdd(true);
    setEditId(item.id);
    setProductName(item.Name);
    setEditImage(item.ImagePath);
  };

  const UpdateQuantity = async (productid) => {
    try {
      // let Quantity=Number(inputValues)
      const response = await axios.put(`${URL}/api/branch/${productid}`, {
        BranchName: BraName,
      });

      if (response.status == 200) {
        const randomIntInRange = getRandomInt(1, 100);

        setRefreash(randomIntInRange);
        setShowAdd(false);
        Toast.show({
          type: "success",
          // And I can pass any custom props I want
          text1: "Quantity Added successfully",
          visibilityTime: 9000, // 4 seconds
        });
        console.log("response", response.data);
      }

      console.log(response.data);

      // console.log("proQty",typeof(Quantity))
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.data.error);
      } else {
        console.error("An error occurred while updating the product quantity.");
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();

    const filteredData = filter(fullDate, (products) => {
      return contains(products.Name, formattedQuery);
    });
    setData(filteredData);
  };

  const contains = (name, query) => {
    const Name = name.toLowerCase();

    if (Name.includes(query)) {
      return true;
    }

    return false;

    console.log(Name);
  };

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        style={{
          backgroundColor: "#3c3f3d",
          padding: 0,
          flex: 1,
          alignItems: "center",
          borderRadius: 15,
          width: ms(100),
          marginBottom: hp(2),
          height: mvs(315),
          justifyContent: "center",
          marginHorizontal: wp(2),
          flexDirection: "column",
          position: "relative",
          paddingVertical: 5,
          borderWidth: 2,
          borderColor: "#ffd953",
        }}
        onPress={() => {
          ActiveItem(item, index, "All", "close");
        }}
      >
        <View
          style={{
            width: "100%",
            height: "40%",
            alignContent: "center",
            justifyContent: "center",
            flex: 1,
            // backgroundColor: "green",
            flexDirection: "row",
            border: "none",
          }}
        >
          <Image
            source={Icon}
            style={{
              width: "80%",
              height: "80%",
              resizeMode: "contain",
              borderRadius: 100,
              marginTop: hp(2),
            }}
            onError={(error) =>
              console.log("Image failed to load:", error.nativeEvent.error)
            }
          />
        </View>

        {/* Product Details */}

        {/* Line (yellow) */}
        <View
          style={{ width: "80%", height: "0.5%", backgroundColor: "#ffd953" }}
        ></View>

        <View
          style={{
            flex: 1,
            width: "100%",
            flexDirection: "column",
            alignItems: "flex-start",
            marginTop: vs(5),
            justifyContent: "space-evenly",
            height: "60%",
            paddingLeft: 9,
            position: "relative",
            display: !item.QuantityO ? "flex" : "none",
          }}
        >
          <View
            style={{
              color: "white",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "90%",
            }}
          >
            <Text
              style={{ fontWeight: 800, fontSize: ms(13, 0.6), color: "white" }}
            >
              Name:
            </Text>
            <Text
              style={{ fontSize: ms(15), color: "#ffd953", fontWeight: 400 }}
            >
              {item.BranchName}
            </Text>
          </View>

          <View
            style={{
              color: "white",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "90%",
            }}
          >
            <Text style={{ fontWeight: 800, fontSize: ms(15), color: "white" }}>
              Location:
            </Text>
            <Text
              style={{ fontSize: ms(15), color: "#ffd953", fontWeight: 400 }}
            >
              {item.Location}
            </Text>
          </View>
        </View>

        {/* Three Dots */}
        <TouchableOpacity
          style={{ position: "absolute", top: 10, right: 0 }}
          onPress={() => {
            ActiveItem(item, index, "action", "open");

            console.log("Button clicked", index);
          }}
        >
          <Entypo name="dots-three-vertical" size={24} color="#ffd953" />
        </TouchableOpacity>

        {
          <View
            style={{
              width: "80%",
              height: "35%",
              backgroundColor: "#ffd953",
              flex: 1,
              position: "absolute",
              top: 5,
              right: 20,
              borderRadius: 20,
              paddingHorizontal: 10,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              borderWidth: 3,
              borderColor: item.selected ? "greem" : "white",
              display: item.selected ? "flex" : "none",
            }}
          >
            {/* edit product */}
            <TouchableOpacity
              onPress={() => {
                // ActiveItem(item, index, "addQ", "open"); // Toggle the actions for this item

                handleInputChange(item, index);

                console.log("Button clicked", index);
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: hp(4),

                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: wp(3), color: "black", fontWeight: 600 }}
                >
                  Edit Branch
                </Text>
                <Ionicons name="add-circle" size={28} color="balck" />
              </View>
            </TouchableOpacity>

            {/* delete product */}
            <TouchableOpacity
              onPress={() => {
                deleteProduct(item.id, item.BranchName);
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: hp(4),

                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: wp(3.5), color: "black", fontWeight: 600 }}
                >
                  Delete
                </Text>
                <MaterialCommunityIcons name="delete" size={28} color="balck" />
              </View>
            </TouchableOpacity>
          </View>
        }

        <View
          style={{
            width: "100%",
            height: "60%",
            backgroundColor: "#ffd953",
            flex: 1,
            position: "absolute",
            top: 150,
            // right: 20,
            borderRadius: 20,
            paddingHorizontal: 10,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            borderWidth: 3,
            borderColor: item.QuantityO ? "greem" : "white",
            display: item.QuantityO ? "flex" : "none",
          }}
          key={index}
        >
          <CustomInput
            setvalue={(text) => {
              setInputValues(text);
              console.log(text);
              setInputValues(text);
            }}
            defaultValue={inputValues}
            editable={true}
            Radius={50}
            Background="#ffd953"
            placeholder="Add Quatity"
            width="80%"
            TRadius={40}
            height={hp(5)}
            Hpadding="2%"
            Bwidth={2}
            TextHeight={hp(5)}
            fontsize={wp(3)}
            alignText="center"
          />

          <CustomButton
            width={wp(35)}
            text="Submit"
            color="#ffa800"
            textcolor="white"
            borderR={10}
            items="center"
            padding="2%"
            marginT="4%"
            onPress={() => UpdateQuantity(item.id)}
            height={hp(7)}
            fontsize={24}
            weight={800}
          />
        </View>

        {/* updtae image */}
        <View
          style={{
            width: "100%",
            height: "60%",
            backgroundColor: "#ffd953",
            flex: 1,
            position: "absolute",
            top: 150,
            // right: 20,
            borderRadius: 20,
            paddingHorizontal: 10,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            borderWidth: 3,
            borderColor: item.ImageChange ? "greem" : "white",
            display: item.ImageChange ? "flex" : "none",
          }}
        >
          <Text>Change Image</Text>
          <ImageBackground
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              backgroundColor: "#ffd953",
              marginTop: 12,
              position: "relative",
            }}
            source={item.icons ? { uri: item.icons } : Icon}
          >
            <Entypo
              name="camera"
              size={27}
              color="white"
              style={{ position: "absolute", bottom: 10, right: 2 }}
              onPress={() => openCameraLib(item, index)}
            />
          </ImageBackground>

          <CustomButton
            width={ms(100, 0.3)}
            text="update"
            color="#ffa800"
            textcolor="white"
            borderR={10}
            items="center"
            padding="2%"
            marginT="4%"
            onPress={() => updateProductImage(item.id, item.icons, item, index)}
            height={mvs(40)}
            fontsize={24}
            weight={800}
          />
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color="#5500dc" />
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => {
        setModel(false);
        fadeOut();
      }}
      style={styles.container}
    >
      {/* Header */}
      <View
        style={{
          width: "100%",
          height: vs(30),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Ionicons
            name="arrow-back-circle-sharp"
            size={30}
            color="white"
            onPress={() => navigation.navigate("Home")}
          />
          <Text style={{ fontSize: hp(2), color: "#838383", fontWeight: 600 }}>
            {" "}
            Will OF God
          </Text>
        </View>

        <Text style={{ fontSize: hp(2), color: "#ffd953", fontWeight: 800 }}>
          Products
        </Text>

        {/* Search Bar View */}

        <View
          style={[
            {
              width: "40%",
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor: "white",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              height: hp(3.5),
              borderWidth: 3,
              backgroundColor: "#ffd953",
            },
            isFocused && styles.focusedContainer,
          ]}
        >
          <FontAwesome name="search" size={24} color="black" />

          <TextInput
            placeholder="Search for a product"
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            clearButtonMode="always"
            autoCorrect={false}
            style={[
              { backgroundColor: "transparent" },

              { width: wp(30) },

              { height: hp(3.5) },

              { fontSize: wp(3) },
            ]}
          />
        </View>
      </View>

      {/* Product List */}

      <ScrollView style={styles.ProductList}>
        <FlashList
          data={products}
          renderItem={renderItem}
          estimatedItemSize={200}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginTop: 4,
          }}
        />
      </ScrollView>

      {/* Product Actions Like Adding Product */}
      {Model && (
        <Animated.View
          style={[styles.ProductActions, { opacity: opacityAnimation }]}
        >
          <TouchableOpacity
            onPress={() => {
              AddProducts();
            }}
          >
            <MaterialIcons
              name="add-shopping-cart"
              size={s(50)}
              color="white"
            />
          </TouchableOpacity>

        </Animated.View>
      )}

      {!Model && (
        <TouchableOpacity
          style={{
            width: s(53),
            position: "absolute",
            bottom: 60,
            right: 25,
          }}
          onPress={() => {
            setModel(true);
            fadeIn();
          }}
        >
          <Entypo name="dribbble-with-circle" size={50} color="#b5f239" />
        </TouchableOpacity>
      )}

      {showAdd && (
        <View style={styles.overlay}>
          <View
            style={{
              width: s(300),
              height: vs(320),
              backgroundColor: "rgba(255, 217, 83, 0.5)",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                width: "30%",
                height: "30%",
                borderRadius: 100,
                // backgroundColor: "#ffd953",
                marginTop: vs(20),
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
                padding: s(20),
              }}
            >
              <Image source={editImage ? { uri: editImage } : Icon} />
            </View>

            <View
              style={{
                width: "80%",
                height: mvs(50),
                alignItems: "center",
                justifyContent: "space-evenly",
                flexDirection: "row",
              }}
            >
              <Text style={{ fontSize: s(20), fontWeight: 600 }}>
                Add Quantity To:
              </Text>
              <Text style={{ fontSize: s(20), fontWeight: 800 }}>
                {productName}
              </Text>
            </View>

            <View
              style={{
                width: "70%",
                height: mvs(150, 0.6),
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
               <CustomInput
                value={BraName}
                setvalue={setBraName}
                Radius={50}
                Background="#ffd953"
                placeholder="Edit Branch Name"
                width="60%"
                TRadius={40}
                height={hp(5)}
                Hpadding="2%"
                Bwidth={2}
                
                TextHeight={hp(5)}
                fontsize={wp(3)}
                alignText="center"
              />

              <CustomButton
                width={wp(35)}
                text="Submit"
                color="#ffa800"
                textcolor="white"
                borderR={10}
                items="center"
                padding="2%"
                marginT="4%"
                onPress={() => UpdateQuantity(editId)}
                height={hp(7)}
                fontsize={24}
                weight={800}
              />
            </View>

            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={() => setShowAdd(false)}
            >
              <MaterialIcons name="cancel" size={s(34)} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: hp(5),
    backgroundColor: "#000000",
    width: "100%",
    position: "relative",
  },
  main: {
    backgroundColor: "#2b2f2b",
    borderRadius: 10,
    paddingLeft: 10,
    paddingVertical: 10,
  },
  focusedContainer: {
    borderColor: "green", // Change border color when focused
  },
  ProductList: {
    width: "100%",
    flex: 1,
    // backgroundColor: "red",
    marginTop: hp(4),
  },
  ProductActions: {
    width: s(67),
    height: hp(40),
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity here
    position: "absolute",
    bottom: 100,
    right: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingRight: 15,
    gap: 1,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Adjust the opacity here
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Index;
