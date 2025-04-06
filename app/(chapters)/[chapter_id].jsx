import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = API_URL; 


export default function LessonsScreen() {
  const [userId, setuserId] = useState("")
  

  useEffect(() => {
    const loadProfile = async () => {
      const Id = await AsyncStorage.getItem("user_id");
      setuserId(Id)
    };
    loadProfile();
  }, []);
  const USER_ID = userId; 
  console.log(USER_ID)
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const router = useRouter();
  const { chapter_id } = useLocalSearchParams();

  useEffect(() => {
    fetchLessons();
    fetchUserProgress();
  }, [userId]);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lessons/${chapter_id}`);
      setLessons(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch lessons");
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/progress/${USER_ID}`);
      setUserProgress(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user progress");
    }
  };

  const canAccessLesson = (lessonId) => {
    return userProgress && lessonId <= userProgress.current_lesson_id;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lessons</Text>
      <FlatList
  data={lessons}
  keyExtractor={(item) => item.lesson_id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => canAccessLesson(item.lesson_id) && router.replace(`/(chapters)/lesson_details?lesson_id=${item.lesson_id}&chapter_id=${chapter_id}`)}
      disabled={!canAccessLesson(item.lesson_id)}
      style={[styles.lessonCard, !canAccessLesson(item.lesson_id) && styles.disabled]}
    >
      <Text style={styles.lessonText}>{item.title}</Text>
    </TouchableOpacity>
  )}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00f",
    marginBottom: 10,
  },
  lessonCard: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  lessonText: {
    fontSize: 18,
    color: "#fff",
  },
  disabled: {
    backgroundColor: "#444",
    opacity: 0.5,
  },
});
