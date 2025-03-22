import { useEffect, useState } from "react";
import { Alert, Button, Text, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/api";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        const response = await fetch(`${API_URL}/profile?user_id=${userId}`);
        if (response.ok) {
          setProfile(await response.json());
        } else {
          Alert.alert("Error", "Failed to load profile");
        }
      }
    };
    loadProfile();
  }, []);

  const logoutUser = async () => {
    await AsyncStorage.clear();
    router.replace("/(authentication)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
    <Text >User Profile</Text>
    {profile ? (
      <View>
       <Text style={styles.text}>Hello {profile.username} </Text>
       <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
       <Link replace href="/(goals)/Addgoals" asChild>
  <TouchableOpacity style={styles.items}>
    <Text>Goals</Text>
  </TouchableOpacity>
</Link>

          <View style={styles.items}>
          </View>
       </View>
       <Button title="Logout" onPress={logoutUser} />

              </View>
    ) : (
      <Button title="Logout" onPress={logoutUser} />
      
    )}
  </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    background:{
        backgroundColor:'black',
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        color:'white'
      },container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 0,
      },
      box:{
        alignItems:"center",
        color:'red',
        flexDirection:'row',
        padding:2,
        marginLeft:8,
        // marginLeft:1,
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
        width:'85%',
        height:43,
        fontSize:20,
        borderRadius:17,
        margin:8,
        paddingLeft:4,
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
    
  });
