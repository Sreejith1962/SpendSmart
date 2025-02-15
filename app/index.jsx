import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
const API_URL = "http://127.0.0.1:5000";

export default function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  
  

  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (storedUserId) {
        setUserId(storedUserId);
        fetchProfile(storedUserId);
      }
    };
    loadUserId();
  }, []);
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

  const loginUser = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log("Login API Response:", JSON.stringify(data, null, 2)); 
      

      if (response.ok) {
        await AsyncStorage.setItem("user_id", data.user_id.toString());
        await AsyncStorage.setItem("access_token", data.access_token); 
        setUserId(data.user_id);
        fetchProfile(data.user_id); 
      } else {
        Alert.alert("Error", data.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };
  const logoutUser = async () => {
    await AsyncStorage.removeItem("user_id");
    setUserId(null);
    setProfile(null);
  };
  return (
    
  
    <View
      style={styles.background}
    >
       {!userId ? (
        <>
          <Text style={styles.main}>Welcome To SpendSmart</Text>
          <Text style={styles.text}>Sign In</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={styles.button} onPress={loginUser} ><Text style={{color:"white",padding:0,fontSize:20}}>Login</Text></Pressable>
          <View style={styles.box}>
        <Text style={{color:'white',fontSize:19}}>Not a registered user? </Text>

        <Link href='./(authentication)/register' asChild>
        <Pressable >
          <Text style={{color:'blue',fontSize:17,}}>Register Now</Text>
        </Pressable>
        </Link>
        
    </View>
    <View style={styles.box}>

    </View>
        </>
      ) : (
        <>
          <Text >User Profile</Text>
          {profile ? (
            <View>
             <Text style={styles.text}>Hello {profile.username} </Text>
             <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                <View style={styles.items}>
                  <Link href="/(goals)/Addgoals" asChild>
                  <Pressable>
                    <Text>Goals</Text>
                  </Pressable>
                  </Link>
                </View>
                <View style={styles.items}>

                </View>
             </View>
             <Button title="Logout" onPress={logoutUser} />

                    </View>
          ) : (
            <Button title="Logout" onPress={logoutUser} />
            
          )}
        </>
      )}
    
    </View>
  );
}
const styles= StyleSheet.create({
  background:{
    backgroundColor:'black',
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    color:'white'
  },
  box:{
    alignItems:"center",
    color:'white',
    flexDirection:'row',
    padding:25,
    marginLeft:20,
    marginLeft:10,
    backgroundColor:"black",
    width:'95%',
    height:40,    


  },
  items:{
    alignItems: "center",
    padding:5,
    margin:15,
    
    backgroundColor:"white",
    width:'85%',
    height:100,    
  },
  main:{
    color:'#2E89DA',
    fontSize:29,
    marginTop:80,
    marginBottom:50
    
  },
  input:{
    backgroundColor:'white',
    color:'black',
    width:'80%',
    height:25,
    fontSize:20,
    borderRadius:20,
    margin:5,
    padding:20,
  },
  text:{
    fontSize:32,
    color:'white',paddingBottom:10,
  },
  button: {
    backgroundColor: "#4E9FFF",
    padding: 8,
      borderRadius: 20,
      margin:14,width:'20%',
      alignItems: 'center'
  }

})