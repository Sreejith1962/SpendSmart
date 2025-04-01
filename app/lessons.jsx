import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@/constants/api";

const API_BASE_URL = API_URL;

const ChapterList = ({ userId }) => {
  const [chapters, setChapters] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user-progress/${userId}`);
      setChapters(response.data.chapters);
      setUserProgress(response.data.progress);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      setLoading(false);
    }
  };

  const handleChapterPress = (chapter) => {
    if (userProgress[chapter.chapter_id]?.status === "locked") return;
    navigation.navigate("LessonList", { userId, chapterId: chapter.chapter_id });
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Chapters</Text>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.chapter_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleChapterPress(item)}
            disabled={userProgress[item.chapter_id]?.status === "locked"}
            style={{
              padding: 20,
              backgroundColor: userProgress[item.chapter_id]?.status === "locked" ? "gray" : "blue",
              marginVertical: 5,
            }}
          >
            <Text style={{ color: "white" }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const LessonList = ({ route }) => {
  const { userId, chapterId } = route.params;
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chapter-progress/${userId}/${chapterId}`);
      setLessons(response.data.lessons);
      setUserProgress(response.data.progress);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setLoading(false);
    }
  };

  const handleLessonPress = (lesson) => {
    if (userProgress[lesson.lesson_id]?.status === "locked") return;
    navigation.navigate("LessonDetail", { userId, lessonId: lesson.lesson_id });
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.lesson_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleLessonPress(item)}
            disabled={userProgress[item.lesson_id]?.status === "locked"}
            style={{
              padding: 20,
              backgroundColor: userProgress[item.lesson_id]?.status === "locked" ? "gray" : "green",
              marginVertical: 5,
            }}
          >
            <Text style={{ color: "white" }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export { ChapterList, LessonList };
