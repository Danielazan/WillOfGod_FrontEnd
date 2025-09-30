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
import Editproduct from "./Editproduct";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import Icon from "../../../assets/icon.png";
import axios from "axios";
import { s, vs, ms, mvs } from "react-native-size-matters";
import filter from "lodash.filter";
import { Image as CompressorImage } from "react-native-compressor";
import { URL } from "../../Url";
import FastImage from "react-native-fast-image";
import { debounce } from 'lodash';

const Index = ({ navigation }) => {
  const [isFocused, setIsFocused] = useState(false);

  const [products, setProducts] = useState([]);

  const [Model, setModel] = useState(false);

  const [productName, setProductName] = useState("Light");

  const [currentPage, setCurrentPage] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");

  const [editId, setEditId] = useState("");

  const [inputValues, setInputValues] = useState("");

  const { Name, DATA, setData, refreash, setRefreash, EditQty, setEditQty } =
    useContext(GlobalContext);

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

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    const date = new Date(dateString);

    // Get the day and month
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Get the weekday
    const weekday = date.toLocaleString("default", { weekday: "long" });

    // Add the suffix for the day
    const suffix = (day) => {
      if (day > 3 && day < 21) return "th"; // Catch all for 4-20
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${weekday} ${day}${suffix(day)} ${year}`;
  };

  const AddProducts = () => {
    navigation.navigate("AddProducts");
  };

  const fetchProducts = async (Page) => {
    
    try {
      const response = await axios.get(`${URL}/api/productsPage?page=${Page}&size=5`);
      // Reverse the products array
      const reversedProducts = response.data;
      return reversedProducts
      

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const initalLoad = async ()=>{
    try {
      setIsLoading(true);

      let  users= await fetchProducts(currentPage)

      setProducts(users);

      setData(users);

      setFullDate(users);

      console.log("Products:", users);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  const deleteProduct = (productId, productName) => {
    new Promise((resolve, reject) => {
      Alert.alert(`Deleting  ${productName}`, "", [
        { text: "Cancel", onPress: () => reject("Call rejected") },
        {
          text: "Continue",
          onPress: () =>
            resolve(
              axios.delete(`${URL}/api/products/${productId}`).then((res) => {
                console.log(res);
                initalLoad();
                Toast.show({
                  type: "success",
                  // And I can pass any custom props I want
                  text1: "Product Deleted Successfully",
                  visibilityTime: 2000, // 4 seconds
                });
              })
            ),
        },
      ]);
    });

  };

  useEffect(() => {
    initalLoad()
  }, [refreash]);

  const handleLoadMore = async () => {
    console.log("is lOadinng...",isLoading);
    if (isLoading) return; // Prevent multiple calls
  
    setIsLoading(true);
    
    const NextPage =currentPage  + 1
    

    let prodata;
    if (searchQuery.trim() === "") {
      prodata = await fetchProducts(NextPage);
    } else {
      prodata = await handleSearchMore(searchQuery,NextPage);
    }
    // prodata = await handleSearchMore(searchQuery,NextPage);
  
     setData([...DATA, ...prodata])
  
    setCurrentPage(NextPage)

    
    setIsLoading(false);
    console.log("Attempting to load more items...",NextPage);
    console.log("is lOadinng...",isLoading);
    
  };

  const debouncedLoadMore = useRef(debounce(handleLoadMore, 1)).current;

  const ActiveItem = (item, index, type, act) => {
    try {
      const NewData = DATA.map((e, idx) => {
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

      setData(NewData);
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

  const openCameraLib = async (item, index) => {
    console.log("PRESSS =====>>>");

    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1, // Set quality to maximum to get the best image for compression
    });

    const selectedImageUri = result?.assets[0]?.uri;

    const compressedImageUri = await CompressorImage.compress(
      selectedImageUri,
      {
        compressionMethod: "manual", // You can choose 'auto' or 'manual'
        maxWidth: 1000, // Set your desired max width
        quality: 0.7, // Set the desired quality (0 to 1)
      }
    );

    setProductImg(compressedImageUri);

    const NewData = await DATA.map((e, idk) => {
      if (item.id === e.id) {
        return {
          ...e,
          icons: compressedImageUri,
        };
      }

      return {
        ...e,
        icons: item.icon,
      };
    });
    setData(NewData);
    console.log("RESULT===>>", result);
  };

  const handleInputChange = (item, index) => {
    setShowAdd(true);
    setEditId(item.id);
    setProductName(item.Name);
    setEditImage(item.ImagePath);
  };

  const updateProductImage = async (productId, image, item, index) => {
    try {
      if (!image) {
        alert("please choose an image");
      } else {
        const formData = new FormData();
        formData.append("productid", productId);
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: "product_image.jpg",
        });

        const response = await axios.put(`${URL}/api/productsimg`, formData, {
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
            text1: "Image Update successful",
            visibilityTime: 9000, // 4 seconds
          });
          console.log("response", response.data);

          ActiveItem(item, index, "All", "close");
        }
      }

      // console.log(productId, "image", image)
    } catch (error) {
      console.error("Error updating product image:", error);
      throw error;
    }
  };

  const UpdateQuantity = async (productid) => {
    try {
      // let Quantity=Number(inputValues)
      const response = await axios.put(`${URL}/api/productsQty`, {
        productid,
        Quantity: Number(inputValues),
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

  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   const formattedQuery = query.toLowerCase();

  //   const filteredData = filter(fullDate, (products) => {
  //     return contains(products.Name, formattedQuery);
  //   });
  //   setData(filteredData);
  // };
  const handleSearch = async (query, Page) => {

    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
  
    try {
      const response = await axios.get(`${URL}/api/Prosearch/${encodeURIComponent(formattedQuery)}`, {
        params: {
          page: Page || 0,
          size: 5
        }
      });
  
      const data = response.data;
  
      setData(data);
      console.log("Search Results:", formattedQuery);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error, e.g., display an error message
    }
  };

  const handleSearchMore  = async (query,Page) => {
    
    try {
     
      const formattedQuery = query.toLowerCase();
  
    
      const response = await axios.get(`${URL}/api/Prosearch/${encodeURIComponent(formattedQuery)}?page=${Page}&size=5`);
  
      const data = response.data;
      console.log("neext call")
      return data
      

    } catch (error) {
      console.error("Error fetching products:", error);
    }
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
          <FastImage
            style={{
              width: "80%",          // Set the width
              height: "80%",         // Set the height
              borderRadius: 20,    // Set the border radius
              borderColor: 'green', // Optional: Set border color
              borderWidth: 2,      // Optional: Set border width
              overflow: 'hidden',   // Ensure the border radius is applied correctly
            }}
            source={{
              uri: `${URL}/images/${item.ImagePath}`,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
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
              {item.Name}
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
              In Stock:
            </Text>
            <Text
              style={{ fontSize: ms(15), color: "#ffd953", fontWeight: 400 }}
            >
              {item.Quantity}
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
              Prev Added:
            </Text>
            <Text
              style={{ fontSize: ms(15), color: "#ffd953", fontWeight: 400 }}
            >
              {item.Previous_Qty}
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
              Newly Added:
            </Text>
            <Text
              style={{ fontSize: ms(15), color: "#ffd953", fontWeight: 400 }}
            >
              {item.NewQtyAdded}
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
              Branch:
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
            {/* <Text style={{ fontWeight: 800, fontSize: ms(13), color: "white" }}>
              Date Updated:
            </Text> */}
            <Text
              style={{ fontSize: ms(12), color: "#ffd953", fontWeight: 400 }}
            >
              {formatDate(item.createdAt)}
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
                  Add Quantity
                </Text>
                <Ionicons name="add-circle" size={28} color="balck" />
              </View>
            </TouchableOpacity>

            {/* Change image*/}
            <TouchableOpacity
              onPress={() => {
                ActiveItem(item, index, "Edit Image", "open"); // Toggle the actions for this item

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
                  style={{ fontSize: wp(3.5), color: "black", fontWeight: 600 }}
                >
                  Change Image
                </Text>
                <FontAwesome name="edit" size={28} color="black" />
              </View>
            </TouchableOpacity>

            {/* delete product */}
            <TouchableOpacity
              onPress={() => {
                deleteProduct(item.id, item.Name);
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

  // if (isLoading || Name != "Admin") {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size={"large"} color="#5500dc" />
  //       <Text>Please Login as Admin or Reconnect Your Data</Text>
  //     </View>
  //   );
  // }

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
            onChangeText={(query) => handleSearch(query,0)}
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

      <ScrollView
        style={styles.ProductList}
        onScroll={({ nativeEvent }) => {
          if (
            nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height >=
            nativeEvent.contentSize.height - 100 // Adjust this value for sensitivity
          ) {
            handleLoadMore(); // Use the debounced version
          }
        }}
      >
        {/* <FlashList
          data={DATA}
          renderItem={renderItem}
          estimatedItemSize={300}
          // keyExtractor={(item) => item.id.toString()}
          keyExtractor={(item) => item.id}
          numColumns={2}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          ListFooterComponent={isLoading && <ActivityIndicator />}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginTop: 4,
          }}
        /> */}

            <FlashList
              data={DATA}
              renderItem={renderItem}
              estimatedItemSize={300}
              initialNumToRender={10} // Number of items rendered initially
              maxToRenderPerBatch={5} // Items rendered per batch during scrolling
              windowSize={10}  
              numColumns={2}       // Size of the viewport window for rendering
              // onEndReached={handleLoadMore}
              // onEndReachedThreshold={0.7}
              ListFooterComponent={isLoading && <ActivityIndicator />}
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

          <TouchableOpacity
            onPress={() => {
              AddProducts();
            }}
          >
            <Image source={pdf} style={{ width: s(40), height: hp(5) }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={Excel} style={{ width: s(40), height: hp(5.5) }} />
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
                setvalue={(text) => {
                  setInputValues(text);
                  console.log(text);
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

              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setEditQty(text)}
                defaultValue={EditQty}
                editable={true}
                multiline={false}
                maxLength={200}
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
