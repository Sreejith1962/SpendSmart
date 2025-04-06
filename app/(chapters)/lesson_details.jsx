import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = API_URL;

export default function LessonDetails() {
  const [userId, setUserId] = useState("");
  const [lesson, setLesson] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [userProgress, setUserProgress] = useState(null);

  const router = useRouter();
  const { lesson_id, chapter_id } = useLocalSearchParams();

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      setUserId(id);
    };
    loadUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLesson();
      fetchUserProgress();
    }
  }, [userId]);
  

  const fetchLesson = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lesson/${chapter_id}/${lesson_id}`);
      setLesson(response.data.lesson);
      setHasNext(response.data.has_next);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch lesson");
    }
  };

  const fetchUserProgress = async () => {
    try {
      if(!userId) return;
      const response = await axios.get(`${API_BASE_URL}/user/progress/${userId}`);
      setUserProgress(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch progress");
    }
  };

  const updateProgress = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/update-progress/${userId}`,
        {
          user_id: userId,
          lesson_id: Number(lesson_id),
          chapter_id: Number(chapter_id),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update progress");
    }
  };

  const handleNext = async () => {
    const nextLessonId = Number(lesson_id) + 1;
    const chapterIdNum = Number(chapter_id);

    const currentLessonProgress = Number(userProgress?.current_lesson_id || 0);
    const currentChapterProgress = Number(userProgress?.current_chapter_id || 0);

    if (
      currentChapterProgress === chapterIdNum &&
      Number(lesson_id) >= currentLessonProgress
    ) {
      await updateProgress();
    }

    if (!hasNext) {
      router.replace(`/quiz?chapterId=${chapterIdNum}&userId=${userId}`);
    } else {
      router.replace(
        `/(chapters)/lesson_details?lesson_id=${nextLessonId}&chapter_id=${chapterIdNum}`
      );
    }
  };

  if (!lesson) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.content}>{lesson.content}</Text>
      <Button title={hasNext ? "Next Lesson" : "Start Quiz"} onPress={handleNext} />
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
  loadingText: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    color: "#fff",
  },
});
