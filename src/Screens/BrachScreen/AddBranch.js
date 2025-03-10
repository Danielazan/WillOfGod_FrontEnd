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
    ActivityIndicator
  } from "react-native";
  import React,{useState,useContext} from 'react'
  import Toast from "react-native-toast-message";
  import ImageBack from "../../../assets/shop4.jpeg"
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
  import Icon from "../../../assets/icon.png"
  import { launchCamera, launchImageLibrary } from "react-native-image-picker";
  import CustomButton from "../../components/CustomButton";
  import CustomInput from "../../components/CustomInput";
  import axios from "axios";
  import { s, vs, ms, mvs } from 'react-native-size-matters';
  import { GlobalContext } from "../../context/index";
  import { Image as CompressorImage } from 'react-native-compressor';
  import {URL} from "../../Url"
  
  
  const AddBranch = ({ navigation }) => {
   
  
      const  getRandomInt= (min, max)=> {
        // The maximum is exclusive and the minimum is inclusive
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
  
   const [BranchName, setBranchName] = useState("")
    const [Location, setLocation] = useState("")

  
    const { refreash, setRefreash } = useContext(GlobalContext);
  
  
    const AddBranch = async () => {

        try {
            
            axios.post(`${URL}/api/branch`, {
                BranchName:BranchName,
                Location:Location,
            })
            .then(response => {
              const randomIntInRange = getRandomInt(1, 100);
                Toast.show({
                    type: "success",
                    // And I can pass any custom props I want
                    text1: `${BranchName} Added successfully`,
                    visibilityTime: 9000, // 4 seconds
                });
              console.log(response.data);
              setBranchName("")
              setLocation("")
              setRefreash(randomIntInRange)
            })
            .catch(error => {
              console.error(error);
            });
          
          
  
          setBranchName("")
          setLocation("")
      
  
          
        } catch (e) {
          console.log("We have an error",e)
        }
    
      navigation.navigate("Branchs");
    };
  
  
  
    
    return (
      <ImageBackground source={ImageBack} style={styles.container}>
       <View style={styles.overlay} />
  
      {/* Header Section */}
       <View style={styles.header}>
          <View style={{flexDirection:"row", width:wp(30),alignItems:"center", justifyContent:"space-evenly"}}>
  
          <Pressable onPress={()=>{navigation.navigate("Home")}} >
          <Ionicons name="arrow-back-circle-sharp" size={30} color="white" />
          </Pressable>
  
          <Text style={{fontSize:wp(4), color:"#ffd953", fontWeight:400}}>Will of God</Text>
          </View>
  
          <View style={{width:wp(35)}}>
            <Text style={{fontSize:wp(4), color:"#ffd953", fontWeight:800}}>Add Branchs</Text>
          </View>
  
          <View style={{width:wp(17)}}>
              <Image source={Icon} style={{width:"60%", height:"90%"}} />
          </View>
  
       </View>
  
       <ScrollView style={styles.scrollView}>
          <View style={{width:"100%", flex:1, alignItems:"center"}}>
  
            <ImageBackground style={{
                    width:200,
                    height: 200,
                    borderRadius: 100,
                    backgroundColor: "#ffd953",
                    marginTop:12,
                    position:"relative"
                  }}
                  source={Icon}
                  >
            </ImageBackground>
                
                {/* Forms to fill */}
                <View style={styles.formPage}>
  
              <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-evenly", width:"100%"}}>
                <Text style={{fontSize:wp(4),color:"black",fontWeight:800}}>Branch Name:</Text>

                <CustomInput
                value={BranchName}
                setvalue={setBranchName}
                Radius={50}
                Background="#ffd953"
                placeholder="Enter Branch Name"
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
  
              <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-evenly", width:"100%"}}>
                <Text style={{fontSize:wp(4),color:"black",fontWeight:800}}>Location:</Text>
                <CustomInput
                value={Location}
                setvalue={setLocation}
                Radius={50}
                Background="#ffd953"
                placeholder="Enter Branch Location"
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
                    width={wp(45)}
                    text="Submit"
                    color="#ffa800"
                    textcolor="white"
                    borderR={10}
                    items="center"
                    padding="2%"
                    marginT="4%"
                    onPress={() => AddBranch()}
                    height={hp(7)}
                    fontsize={24}
                    weight={800}
                  />
      
              </View>
          </View>
       </ScrollView>
      </ImageBackground>
    )
  }
  
  
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
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity here
    },
    header:{
      width:"100%",
      height:vs(30),
      // backgroundColor: "red",
      marginTop:hp(2),
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"space-between"
    },
    formPage: {
      flex: 1,
      backgroundColor: "white",
      width: "80%",
      height: hp(27),
      marginTop: hp(12),
      alignItems: "center",
      justifyContent: "space-evenly",
      borderRadius:20
    },
  });
  
  export default AddBranch