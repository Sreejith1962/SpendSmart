import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_URL } from "@/constants/api";

const QuizScreen = () => {
  const { chapterId } = useLocalSearchParams();  // Fetch passed params
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);  // New state for submitting status
  const [quizScore, setQuizScore] = useState(null);  // State to store the quiz score

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`${API_URL}/generate-quiz/${chapterId}`, {
        method: "POST",
      });
      const data = await response.json();
      
      // Debugging API response
      console.log('API Response:', data);
  
      if (data.quiz) {
        const cleanedQuiz = data.quiz.replace(/^```json\n|\n```$/g, '');  // Clean the JSON string
        const quizData = JSON.parse(cleanedQuiz);  // Parse JSON data
        console.log('Parsed Quiz Data:', quizData); // Debugging quiz data after parsing
        setQuiz(quizData);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      Alert.alert("Error", "Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId, selectedOption) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: selectedOption };
      console.log('Updated Answers:', updatedAnswers);  // Debugging the updated answers state
      return updatedAnswers;
    });
  };

  const submitQuiz = () => {
    let score = 0;
    const totalQuestions = quiz.length;
  
    quiz.forEach((question) => {
      const userAnswer = answers[question.question]; // Get the user's full answer (e.g., 'Groceries')
      const correctAnswer = question.answer; // Correct letter (e.g., 'C')
  
      // Find the option letter corresponding to the user's answer
      const userAnswerLetter = question.options.findIndex(option => option === userAnswer);
      
      // Check if the answer exists in the options and then compare the index with the correct answer letter
      if (userAnswerLetter !== -1 && String.fromCharCode(65 + userAnswerLetter) === correctAnswer) {
        score++;
      }
  
      // Log for debugging
      console.log(`User Answer: ${userAnswer}, Correct Answer: ${correctAnswer}, User Answer Letter: ${String.fromCharCode(65 + userAnswerLetter)}`);
    });
  
    // Update the quiz score state
    setQuizScore(score); // This will set the score in your state
    console.log(`Quiz Score: ${score}/${totalQuestions}`); // Log final score
  };
  
  
  
  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        {quiz?.map((q, index) => {
          console.log('Rendering Question:', q);  // Debugging each question's data
          return (
            <View key={index} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{q.question}</Text>
              {q.options.map((option, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSelectAnswer(q.question, option)}
                  style={{
                    backgroundColor: answers[q.question] === option ? "green" : "gray",
                    padding: 10,
                    marginVertical: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
        
        {/* Submit button */}
        <TouchableOpacity
          onPress={submitQuiz}
          disabled={isSubmitting}  // Disable the button while submitting
          style={{
            backgroundColor: isSubmitting ? "gray" : "blue",  // Change button color while submitting
            padding: 15,
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Submit Quiz</Text>
        </TouchableOpacity>

        {/* Display score after submission */}
        {quizScore !== null && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Your Score: {quizScore} / {quiz.length}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default QuizScreen;
