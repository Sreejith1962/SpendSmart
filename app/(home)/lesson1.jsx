// import React from "react";
// import { View, Text, ScrollView, StyleSheet } from "react-native";

// const FinanceLesson = () => {
//   return (
//     <ScrollView style={styles.container}>
//         <View style={styles.header}>
//   <Text style={styles.chapterText}>Chapter - 1 </Text>
//   <Text style={styles.chapterText}>Lesson - 1</Text>
// </View>

//       <Text style={styles.title}>Managing Personal Finances</Text>
//       <Text style={styles.paragraph}>
//         Managing personal finances is essential for achieving financial stability and long-term success.
//         It involves understanding key financial components, such as income, expenses, assets, and liabilities,
//         as well as implementing strategies like budgeting and goal setting.
//       </Text>
      
//       <Text style={styles.subtitle}>Understanding Income, Expenses, Assets, and Liabilities</Text>
      
//       <Text style={styles.sectionTitle}>Income</Text>
//       <Text style={styles.paragraph}>
//         This is the money you earn through various sources, such as salaries, business profits, rental income,
//         dividends, or passive income sources like investments. Having multiple income streams can provide financial
//         security and reduce dependence on a single source.
//       </Text>
      
//       <Text style={styles.sectionTitle}>Expenses</Text>
//       <Text style={styles.paragraph}>These are the costs incurred to maintain your lifestyle and cover daily needs.</Text>
//       <Text style={styles.listItem}>- Fixed Expenses: Rent, mortgage, insurance, loan payments, and subscriptions.</Text>
//       <Text style={styles.listItem}>- Variable Expenses: Groceries, transportation, dining out, and entertainment.</Text>
//       <Text style={styles.listItem}>- Discretionary Expenses: Non-essential spending, such as vacations and luxury shopping.</Text>
      
//       <Text style={styles.sectionTitle}>Assets</Text>
//       <Text style={styles.paragraph}>These represent things of value that contribute to your wealth.</Text>
//       <Text style={styles.listItem}>- Liquid Assets: Cash, savings accounts, and investments.</Text>
//       <Text style={styles.listItem}>- Fixed Assets: Real estate, vehicles, and valuable possessions.</Text>
//       <Text style={styles.listItem}>- Investments: Stocks, mutual funds, and retirement accounts.</Text>
      
//       <Text style={styles.sectionTitle}>Liabilities</Text>
//       <Text style={styles.paragraph}>These are financial obligations or debts that reduce your overall net worth.</Text>
//       <Text style={styles.listItem}>- Short-term Liabilities: Credit card balances, utility bills, and personal loans.</Text>
//       <Text style={styles.listItem}>- Long-term Liabilities: Home loans, student loans, and car loans.</Text>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//     header: {
//         alignItems: 'center',
//         marginBottom: 10,
//       },
//       chapterText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#4A90E2', // Blue shade
//       },
      
//   container: {
//     flex: 1,
//     backgroundColor: "#121212", // Dark background
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#1E90FF", // Blue color for contrast
//     marginBottom: 15,
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#00BFFF",
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1E90FF",
//     marginTop: 15,
//   },
//   paragraph: {
//     fontSize: 16,
//     color: "#E0E0E0", // Light gray for readability
//     lineHeight: 24,
//     marginBottom: 10,
//   },
//   listItem: {
//     fontSize: 16,
//     color: "#B0C4DE", // Soft blue for better readability
//     marginLeft: 10,
//     marginBottom: 5,
//   },
// });

// export default FinanceLesson;
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
