import { Pressable, StyleSheet, Text, View } from "react-native"; 
import React from "react"; 
import { MaterialCommunityIcons } from "@expo/vector-icons"; 

const CheckBox = (props) => { 
	const iconName = props.isChecked ? 
		"checkbox-marked" : "checkbox-blank-outline"; 

	return ( 
		<View style={styles.container}> 
			<Pressable onPress={props.onPress}> 
				<MaterialCommunityIcons 
					name={iconName} size={24} color="#000" /> 
			</Pressable> 
			<Text style={styles.title}>{props.title}</Text> 
		</View> 
	); 
}; 


const styles = StyleSheet.create({ 
	container: { 
		justifyContent: "flex-start", 
		alignItems: "center", 
		flexDirection: "row", 
		width: "60%", 
		marginTop: 5, 
		marginHorizontal: 5, 
	}, 
	title: { 
		fontSize: 16, 
		color: "red", 
		marginLeft: 5, 
		fontWeight: "600", 
	}, 
}); 

export default CheckBox; 
