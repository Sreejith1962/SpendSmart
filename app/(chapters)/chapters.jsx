import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = API_URL; 

export default function ChaptersScreen() {
  const [userId, setUserId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const Id = await AsyncStorage.getItem("user_id");
        setUserId(Id);
      } catch (e) {
        console.error("Failed to load user ID", e);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchChapters();
      fetchUserProgress();
    }
  }, [userId]); // Run once userId is available

  const fetchChapters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chapters`);
      setChapters(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch chapters");
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/progress/${userId}`);
      setUserProgress(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user progress");
    }
  };

  const canAccessChapter = (chapterId) => {
    return userProgress && chapterId <= userProgress.current_chapter_id;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chapters</Text>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.chapter_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              canAccessChapter(item.chapter_id) &&
              router.replace(`/(chapters)/${item.chapter_id}`)
            }
            disabled={!canAccessChapter(item.chapter_id)}
            style={[
              styles.chapterCard,
              !canAccessChapter(item.chapter_id) && styles.disabled,
            ]}
          >
            <Text style={styles.chapterText}>{item.title}</Text>
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
  chapterCard: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  chapterText: {
    fontSize: 18,
    color: "#fff",
  },
  disabled: {
    backgroundColor: "#444",
    opacity: 0.5,
  },
});
