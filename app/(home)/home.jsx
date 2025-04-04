import { useEffect, useState } from "react";
import { Alert, Button, Text, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/api";
import Icon from 'react-native-vector-icons/FontAwesome'
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
       <View style={styles.container}>
        <StatusBar style="auto" />

        {/* Chapter Button */}
        <View style={styles.roundbox1}>
          <Text style={{ fontSize: 20, color: 'red', paddingTop: 0 }}>Progress</Text>
          <TouchableOpacity style={styles.chapterb} onPress={() =>router.replace('/(chapters)/chapters')}>
            <Text style={styles.buttonText}>Chapter</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
  {/* First Row */}
  <View style={styles.buttonRow}>
    <TouchableOpacity style={styles.circleb} onPress={() => router.replace('/(city-selection)/job-selection')}>
      <Icon name="money" size={60} color="black" />
      <Text style={styles.coursetext}>Jobs</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.circleb} onPress={() => router.replace('/(leaderboard)/Leaderboard')}>
      <MaterialCommunityIcons name="medal" size={60} color="black" />
      <Text style={styles.coursetext}>LeaderBoard</Text>
    </TouchableOpacity>
  </View>

  {/* Second Row */}
  <View style={styles.buttonRow}>
    <TouchableOpacity style={styles.circleb} onPress={() =>router.replace('/(city-selection)/city-selection')}>
      <Icon name="shopping-cart" size={60} color="black" />
      <Text style={styles.coursetext}>City Selection</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.circleb} onPress={() => router.replace('/(goals)/Addgoals')}>
      <MaterialCommunityIcons name="medal" size={60} color="black" />
      <Text style={styles.coursetext}>Goals</Text>
    </TouchableOpacity>
  </View>

  {/* Third Row */}
  <View style={styles.buttonRow}>
    <TouchableOpacity style={styles.circleb} onPress={() =>router.replace('/Stockpage')}>
      <MaterialCommunityIcons name="finance" size={60} color="black" />
      <Text style={styles.coursetext}>Stock Market</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.circleb} onPress={() => router.replace('/(chatbot)/chatbot')}>
      <Icon name="bullseye" size={60} color="black" />
      <Text style={styles.coursetext}>Chat</Text>
    </TouchableOpacity>
  </View>
</ScrollView>


        {/* Main Menu */}
        
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
      },  scrollContainer: {
        paddingVertical: 20,
        alignItems: 'center',
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 20, // Space between rows
      },
      circleb: {
        backgroundColor: '#42A5F5',
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
      },
  safe: {
    flex: 1,
    backgroundColor: 'black',
    padding: '5%',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: '5%',
  },
  roundbox1: {
    width: '90%',
    height: 100,
    backgroundColor: '#90CAF9',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  chapterb: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coursetext: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: 'semi-bold',
    color: 'white',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  circleb: {
    backgroundColor: '#42A5F5',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttoncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    position: 'absolute',
    bottom: 20,
  },
  homeb: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 50,
  },
  leaderb: {
    backgroundColor: '#1565C0',
    padding: 15,
    borderRadius: 50,
  },
  chatb: {
    backgroundColor: '#0D47A1',
    padding: 15,
    borderRadius: 50,
  },
  settingsb: {
    backgroundColor: '#42A5F5',
    padding: 15,
    borderRadius: 50,
  },
    
  });
