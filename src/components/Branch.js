import React, { useState, useContext,useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GlobalContext } from "../context/index";
import { URL } from "../Url.js";
import axios from "axios";

const data = [
  {
    label: "Zamfara State",
    value: "Zamfara State",
  },
  {
    label: "FCT Abuja",
    value: "FCT Abuja",
  },
];

const Reg = () => {
  const {
    Name,
    setName,
    BranchOffice,
    setBranchOffice,
    Passowrd,
    setPassowrd,
    ComfirmPass,
    setComfirmPass,
    Branch,
    setBranch,
  } = useContext(GlobalContext);



  const [value, setValue] = useState(null);

  

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={Branch}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select Branch Office"
      searchPlaceholder="Search..."
      // renderRightItem={image}
      value={BranchOffice}
      onChange={(item) => {
        setBranchOffice(item.value);
      }}
      renderLeftIcon={() => (
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      )}
      renderItem={(item, index) => (
        <View style={styles.option}>
          <Text style={styles.label}>{item.label}</Text>
          {/* <Image source={item.image} style={styles.image} /> */}
        </View>
      )}
    />
  );
};

export default Reg;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    width: wp(40),
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: wp(3),
    color: "black",
    fontWeight: 200,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
    color: "white",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 5,
  },
});
