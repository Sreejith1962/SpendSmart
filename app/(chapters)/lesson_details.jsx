import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_URL } from "@/constants/api";

const API_BASE_URL = API_URL; // Backend URL
const USER_ID = 1; // Replace with actual user ID

export default function LessonDetails() {
  const { lesson_id, chapter_id } = useLocalSearchParams();
  const [lesson, setLesson] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchLesson();
    fetchUserProgress();
  }, [lesson_id]);

  const fetchLesson = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lesson/${chapter_id}/${lesson_id}`);
      setLesson(response.data.lesson);
      setHasNext(response.data.has_next);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch lesson details");
      console.error("Lesson fetch error:", error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/progress/${USER_ID}`);
      setUserProgress(response.data);
      console.log("Fetched user progress:", response.data);
    } catch (error) {
      console.error("Failed to fetch user progress:", error);
    }
  };
  const handleNext = () => {
    if (!hasNext) {
      const currentChapterId = Number(chapter_id);

      router.push(`/quiz?chapterId=${currentChapterId}&userId=${USER_ID}`);
    } else {
      // Normal lesson navigation
      updateProgress();
    }
  };
  const updateProgress = async () => {
    if (!userProgress) return;
  
    const userCurrentLessonId = Number(userProgress.current_lesson_id);
    const currentLessonId = Number(lesson_id);
    const currentChapterId = Number(chapter_id);
  
    // Should update progress if user is on or ahead of their tracked progress
    const shouldUpdateProgress =
      userProgress.current_chapter_id === currentChapterId &&
      currentLessonId >= userCurrentLessonId;
  
    console.log("Checking progress update:", { 
      userProgress, 
      userCurrentLessonId, 
      currentLessonId, 
      shouldUpdateProgress 
    });
  
    if (shouldUpdateProgress) {
      try {
        console.log("Updating progress...");
        await axios.post(`${API_BASE_URL}/update-progress/${USER_ID}`, {
          user_id: USER_ID,
          lesson_id: currentLessonId,
          chapter_id: currentChapterId,
        });
  
        console.log("Progress updated!");
        await fetchUserProgress(); // Ensure UI syncs with backend
  
        // Navigate to next lesson
        router.replace(`/(chapters)/lesson_details?lesson_id=${currentLessonId + 1}&chapter_id=${currentChapterId}`);
      } catch (error) {
        Alert.alert("Error", "Failed to update progress");
        console.error("Progress update error:", error);
      }
    } else {
      console.log("Navigating without updating progress...");
      router.replace(`/(chapters)/lesson_details?lesson_id=${currentLessonId + 1}&chapter_id=${currentChapterId}`);
    }
  };
  
  

  if (!lesson) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
   
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.content}>{lesson.content}</Text>

      <Button title="Next Lesson" onPress={handleNext} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00f",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
});
