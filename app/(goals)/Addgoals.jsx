import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Button,
  Pressable,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemeContext } from "@/ThemeContext/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Link } from "expo-router";
import { API_URL } from "@/constants/api";


const GoalSetting = () => {
  const { colorScheme } = useContext(ThemeContext);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [goals, setGoals] = useState([]);
  const [userId, setUserId] = useState(null);

  // Load user ID and fetch goals on mount
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("user_id");
        if (storedUserId) {
          setUserId(storedUserId);
          fetchGoals(storedUserId);
        }
      } catch (error) {
        console.error("Failed to load user ID:", error);
      }
    };
    loadUserId();
  }, []);

  const fetchGoals = async (user_id) => {
    try {
      console.log("Fetching goals for user:", user_id);
      
      const response = await fetch(`${API_URL}/fetch_goals?user_id=${user_id}`, {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched goals:", data);
  
      if (data.goals) {
        setGoals(data.goals);
      } else {
        setGoals([]);
        Alert.alert("No goals found", "Please add a goal.");
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      Alert.alert("Error", "Failed to load goals. Please try again.");
    }
  };
  

  // Add new goal
  const addGoal = async () => {
    if (!userId || !title || !amount || !time) {
      Alert.alert("Warning", "Please fill all fields before adding a goal.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/add_goal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          goal_name: title,
          year_of_completion: time,
          amount,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Goal added successfully!");
        fetchGoals(userId); // Refresh goals after addition
      } else {
        const data = await response.json();
        Alert.alert("Error", data.error || "Failed to add goal");
      }
    } catch (error) {
      console.error("Error adding goal:", error);
    }

    // Reset form fields
    setTitle("");
    setAmount("");
    setTime("");
  };

  // Delete goal locally
  const deleteGoal = (id) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
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
        <Button title="Add Goal" onPress={addGoal} color="#6200ee" />
      </View>

      <Animated.FlatList
  data={goals}
  keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // Fix for undefined keys
  contentContainerStyle={{ flexGrow: 1 }}
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
        <Pressable onPress={() => deleteGoal(item.id)} style={{ backgroundColor: 'white' }}>
          <Text style={{ color: 'black' }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  )}
/>


      {/* Navigation Button */}
      <Link href="./calculator" asChild>
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
  deleteButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
