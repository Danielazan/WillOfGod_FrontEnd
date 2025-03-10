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
import React from "react";
import { Feather } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale,moderateVerticalScale } from 'react-native-size-matters';

const HomeCards = (props) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.main,
          props.MarginBotton
            ? { marginBottom: props.MarginBotton }
            : { marginBottom: 20 },

            props.MainWidth ? { width: props.MainWidth } : { width:scale(150)},

            props.MainHeight ? { height: props.MainHeight } : { height: moderateVerticalScale(122, 0.3)}
        ]}
      >
        {props.icon ? (
          props.icon
        ) : (
          <Feather
            name="command"
            size={props.iconSize ? props.iconSize : 34}
            color={props.iconcolor ? props.iconcolor : "white"}
          />
        )}

        <Text
          style={[
            props.color1 ? { color: props.color1 } : { color: "white" },

            props.font1 ? { fontSize: props.font1 } : { fontSize: moderateScale(20) },

            props.marginB1
              ? { marginBottom: props.marginB1 }
              : { marginBottom: verticalScale(1.5) },

            props.marginT1 ? { marginTop: props.marginT1 } : { marginTop: 10 },

            props.fontWeight ? { fontWeight: props.fontWeight } : { fontWeight: 800 },

          ]}
        >
          {props.text1 ? props.text1 : "Overview"}
        </Text>

        <Text
          style={[
            props.color2 ? { color: props.color2 } : { color: "#fea500" },

            props.font2 ? { fontSize: props.font2 } : { fontSize: 18 },

            {marginTop:2}
          ]}

          
        >
          {props.text2 ? props.text2 : "cefewdfewdcefewdfewd"}{" "}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    backgroundColor: "#2b2f2b",
    borderRadius: 10,
    paddingLeft: 10,
    paddingVertical: 10,
  },
});

export default HomeCards;
