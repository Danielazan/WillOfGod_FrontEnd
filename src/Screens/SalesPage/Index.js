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
import React, { useState, useEffect, useContext, useRef } from "react";
import { GlobalContext } from "../../context/index";
import CheckBox from "../../components/Checkbox";
import {
  Feather,
  FontAwesome,
  Ionicons,
  AntDesign,
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Toast from "react-native-toast-message";
import { FlashList } from "@shopify/flash-list";
import axios from "axios";
import { s, vs, ms, mvs } from "react-native-size-matters";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import filter from "lodash.filter";
import { URL } from "../../Url";

const Index = ({ navigation }) => {
  const [isFocused, setIsFocused] = useState(false);

  const [products, setProducts] = useState([]);

  const [fullDate, setFullDate] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [isChecked, setIsChecked] = useState(false);

  const [Num, setNum] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef(null);

  const { DATA, setData, refreash, setRefreash, EditQty, setEditQty } =
    useContext(GlobalContext);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${URL}/api/products`);
      // Reverse the products array
      const reversedProducts = response.data.reverse();

      setProducts(reversedProducts);

      setData(reversedProducts);

      setFullDate(reversedProducts);
      console.log("Products:", reversedProducts);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreash]);

  const toggleCheckBox = (item, index) => {
    setData((prevData) =>
      prevData.map((pro) =>
        item.id === pro.id
          ? { ...pro, isChecked: !pro.isChecked } // Toggle isChecked for the matching item
          : pro
      )
    );
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

  const handleNumChange = (text) => {
    setNum(text);
  };

  const handleFocus = (index) => {
    flatListRef.current.scrollToIndex({
      index,
      animated: true,
      viewOffset: 50, // Adjust the offset as needed
    });
  };

  const handleBlur = () => {
    flatListRef.current.scrollToOffset({
      offset: 0,
      animated: true,
    });
  };

  const ActiveItem = (item, index) => {
    setData((prevData) =>
      prevData.map((pro) =>
        item.id === pro.id
          ? { ...pro, NumData: (pro.NumData || 0) + 1 } // Increment NumData safely
          : pro
      )
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        style={{
          backgroundColor: "rgb(236,236,236)",
          padding: 0,
          flex: 1,
          alignItems: "center",
          borderRadius: 15,
          width: "100%",
          marginBottom: hp(2),
          height: mvs(105),
          justifyContent: "space-evenly",
          flexDirection: "row",
          position: "relative",
          paddingVertical: 5,
          borderWidth: 2,
          borderColor: "#ffd953",
        }}
        // onPress={() => {
        //   ActiveItem(item, index, "All", "close");
        // }}
      >
        <ImageBackground
          style={{
            width: ms(79),
            height: mvs(75, 0.7),
            alignContent: "center",
            justifyContent: "center",
            // backgroundColor: "green",
            flexDirection: "row",
            // borderWidth:2,
            borderRadius: ms(35),
          }}
        >
          <Image
            source={{
              uri: `${URL}/images/${item.ImagePath}`,
            }}
            style={{
              width: ms(76),
              height: mvs(76),
              resizeMode: "stretch",
              borderRadius: ms(37),
            }}
            onError={(error) =>
              console.log("Image failed to load:", error.nativeEvent.error)
            }
          />
        </ImageBackground>

        {/* Sales details */}
        <View
          style={{
            width: ms(120, 0.7),
            height: "100%",
            // backgroundColor: "red",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: 800, fontSize: ms(14) }}>{item.Name}</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: ms(12), fontWeight: 800 }}>
              In Stock:{" "}
            </Text>
            <Text style={{ fontSize: ms(12), fontWeight: 600 }}>
              {item.Quantity}
            </Text>
          </View>
        </View>

        <View
          style={{
            width: ms(80, 0.7),
            height: "100%",
            // backgroundColor: "red",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              ActiveItem(item, index);
            }}
          >
            <AntDesign name="pluscircle" size={ms(18)} color="black" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(item.NumData ? item.NumData : Num)}
            placeholder="0"
            onFocus={(value) => handleFocus(index)}
            onBlur={handleBlur}
          />

          <TouchableOpacity>
            <AntDesign name="minuscircle" size={ms(18)} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => toggleCheckBox(item, index)}>
          <CheckBox
            title=""
            checked={item.isChecked}
            onPress={() => toggleCheckBox(item, index)}
          />
        </TouchableOpacity>
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
    <View style={styles.container}>
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
          ref={flatListRef}
          data={DATA}
          renderItem={renderItem}
          estimatedItemSize={200}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          columnWrapperStyle={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 4,
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: hp(5),
    backgroundColor: "rgb(152,152,152)",
    width: "100%",
    position: "relative",
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
  input: {
    height: mvs(23),
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    width: s(32),
    fontSize: s(12),
    color: "black",
  },
});

export default Index;
