import { API_URL } from "@/constants/api";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const App = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("India");

  const registerUser = async () => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, location }),
      });

      const data = await response.json();
      
      
      if (response.ok && data.message === "User registered successfully") {
        console.log("Registered");

        if (data.user_id) {
          await AsyncStorage.setItem("user_id", data.user_id.toString());
          console.log("User ID stored:", data.user_id);
        } else {
          console.error("User ID missing in response");
        }

        
        if (Platform.OS === "web") {
          window.alert("User registered successfully!");
        } else {
          Alert.alert("Success", "User registered successfully!");
        }

        setTimeout(() => {
          router.replace("/(city-selection)/city-selection");
        }, 200);
      } else {
        const errorMsg = data.message || "Registration failed";
        Platform.OS === "web" ? window.alert(errorMsg) : Alert.alert("Error", errorMsg);
      }
    } catch (error) {
      console.error("Network Error:", error);
      Platform.OS === "web" ? window.alert("Something went wrong") : Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.background}>
      <Text style={styles.maintext}>Register</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Pressable style={styles.button} onPress={registerUser}>
        <Text style={styles.text}>Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    color: "black",
    width: "85%",
    height: 43,
    fontSize: 20,
    borderRadius: 17,
    margin: 8,
    paddingLeft: 4,
  },
  text: {
    fontSize: 20,
    color: "white",
  },
  maintext: {
    fontSize: 32,
    color: "white",
  },
  button: {
    alignItems: "center",
    backgroundColor: "blue",
    width: "85%",
    height: 32,
    borderRadius: 20,
    margin: 10,
  },
});
