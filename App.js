import { StatusBar } from "expo-status-bar";
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
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DatabaseProvider } from "./src/context/database";
import Home from "./src/Screens/HomeScreen/Index";
import Login from "./src/Screens/FormScreen/Login";
import Register from "./src/Screens/FormScreen/Register";
import Product from "./src/Screens/ProductScreen/Index";
import Sales from "./src/Screens/SalesPage/Index";
import AddProducts from "./src/Screens/ProductScreen/AddProducts";
import GlobalState from "./src/context/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddBranch from "./src/Screens/BrachScreen/AddBranch";
import Branch from "./src/Screens/BrachScreen/Index";

import Invocies from "./src/Screens/InvoiceScreen/Index";

const Stack = createNativeStackNavigator();

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, text2, names, props }) => (
    <View
      style={{
        height: 60,
        width: "80%",
        backgroundColor: "black",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 30,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
    >
      <View
        style={{
          width: "50%",
          flexDirection: "row",
          // backgroundColor: "blue",
          height: "auto",
          alignItems: "center",
          gap: 10,
          // paddingBottom:10
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: "white",
          }}
        >
          <Image
            source={Logo}
            style={{ borderRadius: 50, width: "90%", height: "100%" }}
            resizeMode="stretch"
          />
        </View>
        <Text style={{ color: "white" }}>{names}</Text>
      </View>

      <View
        style={{
          width: "40%",
          flexDirection: "row",
          // backgroundColor: "blue",
          height: "auto",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          // paddingBottom:10
        }}
      >
        <TouchableOpacity onPress={props.onPress}>
          <Ionicons name="call" size={24} color="green" />
        </TouchableOpacity>

        <TouchableOpacity onPress={props.onPresst}>
          <MaterialIcons name="call-end" size={34} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  ),
};

export default function App() {
  const getName = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("MyDetailed");
      if (jsonValue !== null) {
        const value = JSON.parse(jsonValue); // Parse the JSON string back to an object
        console.log(value.Name); // Access the Name property
        return value.Name; // Return the Name if needed
      } else {
        console.log("No data found");
        return null; // Return null if no data is found
      }
    } catch (e) {
      // error reading value
      console.error("Error retrieving data", e);
    }
  };

  const Name = getName();

  return (
    <GlobalState>
      <NavigationContainer>
        <Stack.Navigator>
          { (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
          )}

          {Name && (
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
          )}

          <Stack.Screen
            name="SignUp"
            component={Register}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Products"
            component={Product}
            options={{
              headerShown: false,
              unmountOnBlur: true,
            }}
          />

          <Stack.Screen
            name="AddProducts"
            component={AddProducts}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Sales"
            component={Sales}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="AddBranchs"
            component={AddBranch}
            options={{
              headerShown: false,
            }}
          />
          {
            <Stack.Screen
              name="Branchs"
              component={Branch}
              options={{
                headerShown: false,
              }}
            />
          }

          <Stack.Screen
            name="Invocies"
            component={Invocies}
            options={{
              headerShown: false,
            }}
          />

          {/* <Stack.Screen
            name="DHome"
            component={DHome}
            options={{
              headerShown: false,
            }}
          /> */}
        </Stack.Navigator>
        <Toast config={toastConfig} />
      </NavigationContainer>
    </GlobalState>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
