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

  const [currentPage, setCurrentPage] = useState(0);

  const [inputValues, setInputValues] = useState("");

  const { DATA, setData, refreash, setRefreash, EditQty, setEditQty,cusDATA, setCusData } =
    useContext(GlobalContext);

  const [ProductImg, setProductImg] = useState("");

  const [fullDate, setFullDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [ItemsBought, setItemsBought] = useState(false);

  const [editImage, setEditImage] = useState(null);

  const [showAdd, setShowAdd] = useState(false);

  const opacityAnimation = useRef(new Animated.Value(0)).current; // Start with opacity 0

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

    return `${weekday} ${day}${suffix(day)} ${month} ${year}`;
  };

  const fetchCustomers = async (Page) => {
    try {
      const response = await axios.get(`${URL}/api/customerbypage?page=${Page}&size=200`);
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

      let  users= await fetchCustomers(currentPage)

      setProducts(users);

      setCusData(users);

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
                fetchCustomers();
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

  let tems = false;

  useEffect(() => {
    initalLoad();
  }, []);

  const ActiveItem = (item, index) => {
    try {
      const NewData = products
        .filter((e) => item.id === e.id)
        .map((e) => e.Items);
      setItemsBought(JSON.parse(NewData));

      tems = JSON.parse(NewData);
      console.log(JSON.parse(NewData));
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

  // useEffect(() => {
  //   console.log(">>>>>", ItemsBought);
  // }, [ItemsBought]);

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

  const handleLoadMore = async () => {
    console.log("is lOadinng...",isLoading);
    if (isLoading) return; // Prevent multiple calls
  
    setIsLoading(true);
    
    const NextPage =currentPage + 1
  
     let prodata = await fetchCustomers(NextPage)
  
    //  setProducts((prevProducts) => [...prevProducts, ...prodata]) // Append new data

    setProducts([...products, ...prodata])

    setCusData([...products, ...prodata])
  
    setCurrentPage(NextPage)

    
    setIsLoading(false);
    console.log("Attempting to load more items...",NextPage);
    console.log("is lOadinng...",isLoading);
    
  };

  const FillItemsBought = (items) => {
    items.map((item) => console.log(items));
    // setModel(items)
  };

  const RenderItemsTable = ({ item }) => {
    return (
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
          height: "60%",
        }}
      >
        <Pressable
          style={{
            backgroundColor: "#3c3f3d",
            padding: 0,
            flex: 1,
            alignItems: "center",
            borderRadius: 15,
            width: "100%",
            marginBottom: hp(2),
            height: "100%",
            justifyContent: "space-evenly",
            flexDirection: "column",
            gap: vs(12),
            position: "relative",
            paddingVertical: 5,
            borderWidth: 2,
            borderColor: "#ffd953",
            paddingVertical: vs(25),
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              left:1,
              // backgroundColor: "red",
              width: "30%",
              height: "20%",
              flexDirection:"row",
              alignItems:"center",
              justifyContent:"space-evenly"
            }}

            onPress={()=>setItemsBought(false)}
          >
            <MaterialIcons name="cancel" size={24} color="white" />
            <Text style={{color:"white", fontSize:18, fontWeight:400}}>Go Back</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              height: vs(84),
              width: "100%",
            }}
          >
            <View
              style={{
                width: "70%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: s(16), fontWeight: 800, color: "#ffd953" }}
              >
                Product Name
              </Text>

              <Text
                style={{ fontSize: s(14), fontWeight: 600, color: "white" }}
              >
                {item.product_name}
              </Text>
            </View>

            <View
              style={{
                width: "60%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: s(16), fontWeight: 800, color: "#ffd953" }}
              >
                Quantity
              </Text>
              <Text
                style={{ fontSize: s(14), fontWeight: 600, color: "#ffd953" }}
              >
                {item.quantity}
              </Text>
            </View>

            <View
              style={{
                width: "60%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: s(16), fontWeight: 800, color: "#ffd953" }}
              >
                Price Sold
              </Text>
              <Text
                style={{ fontSize: s(14), fontWeight: 600, color: "#ffd953" }}
              >
                {item.price}
              </Text>
            </View>

            <View
              style={{
                width: "60%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: s(16), fontWeight: 800, color: "#ffd953" }}
              >
                Total
              </Text>
              <Text
                style={{ fontSize: s(14), fontWeight: 600, color: "#ffd953" }}
              >
                {item.amount}
              </Text>
            </View>
          </View>
        </Pressable>
      </ScrollView>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <ScrollView style={{ flex: 1, width: "100%", height: "100%" }}>
        <Pressable
          style={{
            backgroundColor: "#3c3f3d",
            padding: 0,
            flex: 1,
            alignItems: "center",
            borderRadius: 15,
            width: "100%",
            marginBottom: hp(2),
            height: "100%",
            justifyContent: "space-evenly",
            flexDirection: "column",
            gap: vs(112),
            position: "relative",
            paddingVertical: 5,
            borderWidth: 2,
            borderColor: "#ffd953",
            paddingVertical: vs(25),
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              marginTop: vs(5),
              justifyContent: "space-evenly",
              gap: vs(10),
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
                style={{
                  fontWeight: 800,
                  fontSize: ms(18, 0.6),
                  color: "white",
                }}
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
              <Text
                style={{ fontWeight: 800, fontSize: ms(19), color: "white" }}
              >
                Contact:
              </Text>
              <Text
                style={{ fontSize: ms(15), color: "#ffd953", fontWeight: 400 }}
              >
                {item.Contact}
              </Text>
            </View>

            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "colum",
              }}
            >
              <TouchableOpacity
                style={{
                  borderColor: "red",
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 10,
                  width: "50%",
                }}
                onPress={() => {
                  ActiveItem(item, index);
                }}
              >
                <Text
                  style={{ fontSize: s(20), fontWeight: 800, color: "white" }}
                >
                  Items Bought
                </Text>
              </TouchableOpacity>

              {/* {RenderItemsTable(item.Items)} */}
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
              <Text
                style={{ fontWeight: 800, fontSize: ms(19), color: "white" }}
              >
                Total Amount:
              </Text>
              <Text
                style={{ fontSize: ms(15), color: "#ffd953", fontWeight: 400 }}
              >
                {item.TotalAmount}
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
              <Text
                style={{ fontWeight: 800, fontSize: ms(19), color: "white" }}
              >
                SoldBy:
              </Text>
              <Text
                style={{ fontSize: ms(15), color: "#ffd953", fontWeight: 400 }}
              >
                {item.SoldBy}
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
              <Text
                style={{ fontWeight: 800, fontSize: ms(19), color: "white" }}
              >
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
        </Pressable>
      </ScrollView>
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
          Invioce
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

      <View
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          alignItem: "center",
          justifyContent: "center",
        }}
      >
        { !ItemsBought ?

          <ScrollView style={styles.ProductList}
          // onScroll={({ nativeEvent }) => {
          //   if (
          //     nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height >=
          //     nativeEvent.contentSize.height - 100 // Adjust this value for sensitivity
          //   ) {
          //     handleLoadMore(); // Use the debounced version
          //   }
          // }}
          >
            <FlashList
              data={ cusDATA }
              renderItem={renderItem}
              estimatedItemSize={300}
              initialNumToRender={10} // Number of items rendered initially
              maxToRenderPerBatch={5} // Items rendered per batch during scrolling
              windowSize={10}  
              keyExtractor={(item) =>
                 item.id.toString() 
              }
              numColumns={1}
              ListFooterComponent={isLoading && <ActivityIndicator />}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginTop: 4,
              }}
            />
          </ScrollView>

          :
          <ScrollView style={styles.ProductList}
          >
            <FlashList
              data={ ItemsBought }
              renderItem={RenderItemsTable }
              estimatedItemSize={200}
              keyExtractor={(item) =>
                 item.product_Id
              }
              numColumns={1}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginTop: 4,
              }}
            />
          </ScrollView>
        }
      </View>
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