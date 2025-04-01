import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { API_URL } from "@/constants/api";

const API_BASE_URL = API_URL; // Replace with your actual backend URL
const USER_ID = 1; // Test user ID, replace with dynamic user input if needed

export default function App() {
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetchChapters();
    fetchUserProgress();
  }, []);

  const fetchChapters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chapters`);
      setChapters(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch chapters");
    }
  };

  const fetchLessons = async (chapterId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lessons/${chapterId}`);
      setLessons(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch lessons");
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/progress/${USER_ID}`);
      setProgress(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user progress");
    }
  };

  const updateProgress = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/update-progress/${USER_ID}`);
      setProgress(response.data);
      Alert.alert("Success", "Progress Updated!");
    } catch (error) {
      Alert.alert("Error", "Failed to update progress");
    }
  };

  const skipToNextChapter = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/skip-to-next-chapter/${USER_ID}`);
      setProgress(response.data);
      Alert.alert("Success", "Moved to Next Chapter!");
    } catch (error) {
      Alert.alert("Error", "Failed to skip chapter");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Chapters</Text>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.chapter_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => fetchLessons(item.chapter_id)}>
            <Text style={{ fontSize: 18, padding: 5 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.lesson_id.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 16, padding: 5 }}>{item.title}</Text>
        )}
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>User Progress</Text>
      {progress && (
        <Text style={{ fontSize: 18 }}>
          Chapter: {progress.current_chapter_id}, Lesson: {progress.current_lesson_id}
        </Text>
      )}
      <Button title="Next Lesson" onPress={updateProgress} />
      <Button title="Skip to Next Chapter" onPress={skipToNextChapter} />
    </View>
  );
}
