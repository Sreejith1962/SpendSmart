import { useState } from "react";
import { Alert, Button, TextInput, View, Text, Pressable, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginUser = async () => {
    try {
      console.log("Attempting login...");
  
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log("Login API Response:", JSON.stringify(data, null, 2)); 
  
      if (response.ok) {
        console.log("Login successful! Waiting for data stabilization...");
  
        await new Promise(resolve => setTimeout(resolve, 50));
  
        if (!data.user_id ) {
          console.error("Login failed: Missing user_id or access_token", data);
          Alert.alert("Error", "Invalid response from server");
          return;
        }
  
        console.log("Storing user data...");
        await AsyncStorage.setItem("user_id", data.user_id.toString());
        await AsyncStorage.setItem("balance", data.account_balance);
        
        setUserId(data.user_id);
        fetchProfile(data.user_id);
        router.push("(home)/home")
      } else {
        console.error("Login failed:", data.message);
        Alert.alert("Error", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Network or server error:", error);
      Alert.alert("Error", "Something went wrong. Check network or API.");
    }
  };
  const fetchProfile = async (user_id) => {
    try {
      const response = await fetch(`${API_URL}/profile?user_id=${user_id}`, {
        method: "GET",
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setProfile(data);
      } else {
        Alert.alert("Error", "Failed to load profile");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SpendSmart</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Pressable style={styles.button} onPress={loginUser} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
      </Pressable>
      <Text style={{color:'white',fontSize:19,paddingTop:14}}>Not a registered user? 
        <Link  href='/(authentication)/register' asChild>
        <Pressable >
          <Text style={{color:'blue',fontSize:17,}}> Register Now</Text>

        </Pressable>
        </Link>
        </Text>
    </View>
  );
}

const styles =  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#121212",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    title: {
      fontSize: 28,
      color: "#4E9FFF", 
    //   fontWeight: "bold",
      marginBottom: 30,
    },
    input: {
      backgroundColor: "white",
      color: "black",
      width: "85%",
      height: 45,
      fontSize: 18,
      borderRadius: 15,
      paddingLeft: 10,
      marginBottom: 15,
    },
    button: {
      backgroundColor: "#4E9FFF",
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginTop: 10,
    },
    buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
