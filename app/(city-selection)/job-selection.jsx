import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/api"; // Ensure this is correctly set

const JobSelectionScreen = () => {
  const router = useRouter();
  const [city, setcity] = useState("Kochi")
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch city salary and rent data
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await fetch(`${API_URL}/city-cost?city=${city}`);
        const data = await response.json();

        if (response.ok) {
          generateRandomJobs(data);
        } else {
          throw new Error(data.message || "Failed to fetch city data");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, [city]);

  // Generate 3 random jobs with salary within the range
  const generateRandomJobs = (data) => {
    const { salary_min, salary_max, rent_min, rent_max } = data;

    const jobTitles = ["Software Engineer", "Data Analyst", "Product Manager", "UI/UX Designer", "Cybersecurity Specialist", "Financial Advisor", "Marketing Manager", "AI Engineer"];
    
    const getRandomSalary = () => 
      (Math.random() * (salary_max - salary_min) + salary_min).toFixed(2);

    const getRandomRent = () => 
      (Math.random() * (rent_max - rent_min) + rent_min).toFixed(2);

    const randomJobs = Array.from({ length: 3 }, () => ({
      title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      salary: getRandomSalary(),
      rent: getRandomRent(),
    }));

    setJobs(randomJobs);
  };

  const selectJob = async (job) => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
  
      if (!userId) {
        Alert.alert("Error", "User ID not found");
        return;
      }
  
      const response = await fetch(`${API_URL}/update-user-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: userId, 
          salary: job.salary, 
          rent: job.rent 
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        await AsyncStorage.setItem("salary", job.salary);
        await AsyncStorage.setItem("rent", job.rent);
        Alert.alert("Success", `You selected ${job.title} with salary ₹${job.salary} and rent ₹${job.rent}`);
        router.push("/home");
      } else {
        throw new Error(result.message || "Failed to update job info");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Job</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        jobs.map((job, index) => (
          <View key={index} style={styles.jobCard}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text>💰 Salary: ₹{job.salary}</Text>
            <Text>🏠 Rent: ₹{job.rent}</Text>
            <Button title="Choose This Job" onPress={() => selectJob(job)} />
          </View>
        ))
      )}
    </View>
  );
};

export default JobSelectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  jobCard: { backgroundColor: "#f0f0f0", padding: 15, margin: 10, borderRadius: 10, width: "90%", alignItems: "center" },
  jobTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
});
