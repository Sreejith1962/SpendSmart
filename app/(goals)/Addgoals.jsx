import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, Button, Pressable, Alert, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemeContext } from "@/ThemeContext/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Link } from "expo-router";

const API_URL = "http://127.0.0.1:5000";

const GoalSetting = () => {
  const { colorScheme, theme } = useContext(ThemeContext);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [goals, setGoals] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (storedUserId) {
        setUserId(storedUserId);
        fetchGoals(storedUserId);
        console.log(userId)
      }
    };


    loadUserId();
  }, []);

  const fetchGoals= async (user_id) => {
    try {
        console.log("From fetch")
      const response = await fetch(`${API_URL}/fetch_goals?user_id=${user_id}`, {
        method: "GET",
      });

      const data = await response.json();
      console.log(data.goals)
      setGoals(data.goals)
      if (response.ok) {
        setProfile(data);
      } else {
        Alert.alert("Error", "Failed to load profile");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

 
  const addGoal = async (userId, goalName, yearOfCompletion, amount) => {
    
    try {
        const response = await fetch('http://127.0.0.1:5000/add_goal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                goal_name: goalName,
                year_of_completion: yearOfCompletion,
                amount: amount,
                
            }),
        });
        
        const data = await response.json();
        if (response.ok) {
            alert('Goal added successfully!');
            
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error adding goal:', error);
    }
    fetchGoals(userId)
};

  const deleteGoal =(id)=>{
    setGoals(goals.filter(goal=>goal.id!==id))
  }
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
      <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, ]}
          placeholder="Goal Title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          placeholderTextColor="#aaa"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Time Frame"
          placeholderTextColor="#aaa"
          value={time}
          onChangeText={setTime}
        />
        <Button title="Add Goal" onPress={()=>addGoal(userId,title,time,amount)} color={ "#6200ee"} />
      </View>

      <Animated.FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{flexGrow:1}}

        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <View style={styles.titleContainer}>

              <Text style={styles.goalTitle}>{item.goal_name}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.goalAmount}>Amount: {item.amount}</Text>
              <Text style={styles.goalTime}>Time: {item.year_of_completion}</Text>
            </View>
            <View>
              <Pressable onPress={()=>deleteGoal(item.id)} style={{backgroundColor:'white'}}>
                  <Text style={{color:'black'}}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
        
      />
       </ScrollView>
      <Link href='./calculator' asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Calculate</Text>
          </Pressable>
      </Link>
     
    </SafeAreaView>
  );
};

export default GoalSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#fff",
    backgroundColor: "#1e1e1e",
  },
  goalItem: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
  },
  detailsContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  goalAmount: {
    fontSize: 14,
    color: "#bbb",
  },
  goalTime: {
    fontSize: 14,
    color: "#bbb",
  },
  button: {
    backgroundColor: 'linear-gradient(45deg, #00BFFF, #1E90FF)', 
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 30,
    shadowColor: '#1E90FF', 
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', 
    textAlign: 'center',
  },
});
