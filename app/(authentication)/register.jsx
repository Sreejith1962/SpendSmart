
import { API_URL } from "@/constants/api";
import {  useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native"



const App= ()=>{
    const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [email, setEmail] = useState("");
      const [location,setLocation]=useState("India")
      
    const registerUser = async () => {
        try {
          const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email, location }),
          });
    
          const data = await response.json();
          if (response.ok) {
            Alert.alert("Success", "User registered successfully!");
            
          } else {
            Alert.alert("Error", data.message || "Registration failed");
          }
        } catch (error) {
          Alert.alert("Error", "Something went wrong");
        }
      };
    
    return(
        <View style={styles.background}>
            
            <Text style={styles.maintext}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        <Pressable style={styles.button} onPress={registerUser} >
          <Text style={styles.text}>Sign Up</Text>
          </Pressable>

        </View>
    )
}
export default App
const styles= StyleSheet.create({
  background:{
    backgroundColor:'black',
    flex: 1,
    alignItems: "center",
    color:'white'
  },
  box:{
    alignItems: "center",
    
    color:'white',
    flexDirection:'row',
    padding:25,
    margin:5,
    marginLeft:20,
    backgroundColor:"black",
    width:'95%',
    height:50,    


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
    width:'85%',
    height:43,
    fontSize:20,
    borderRadius:17,
    margin:8,
    paddingLeft:4,
  },
  text:{
    fontSize:20,
    color:'white',paddingBottom:10,
  },
  maintext:{
    fontSize:32,
    color:'white',paddingBottom:10,
  },
  button:{
    alignItems:'center',
    color:'white',
    backgroundColor:'blue',
    width:'85%',
    height:32,
    borderRadius:20,
    margin:10
  }
})