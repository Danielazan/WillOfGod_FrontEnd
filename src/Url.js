import { Platform } from 'react-native';

// let URL= "http://13.53.88.231:8000"

let URL

if (Platform.OS === "android") {
    URL = "http://10.0.2.2:8000"; // Android URL
} else if (Platform.OS === "ios") {
    URL = "http://localhost:8000"; // iOS URL
} else {
    // Handle other platforms if needed
    throw new Error("Unsupported platform");
}

export { URL };