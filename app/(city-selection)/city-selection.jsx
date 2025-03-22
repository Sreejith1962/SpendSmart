import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/api";

export default function CitySelection() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/cities`)
      .then(response => {
        setCities(response.data);
      })
      .catch(error => {
        console.error("Error fetching city data:", error);
      });
  }, []);

  const selectCity = async (cityName) => {
    try {
      const user_id = await AsyncStorage.getItem("user_id"); 
      await axios.post(`${API_URL}/update-city`, {
        user_id: user_id,
        city_name: cityName
      });

      alert(`City updated to ${cityName}`);
    } catch (error) {
      console.error("Error updating city:", error);
    }
  };

  return (
    <View style={styles.container}>
      {cities.map(city => (
        <Pressable key={city.city_name} onPress={() => selectCity(city.city_name)} style={styles.cityBox}>
          <Text style={styles.cityText}>{city.city_name}</Text>
          <Text>Rent: {city.rent_min} - {city.rent_max}</Text>
          <Text>Salary: {city.salary_min} - {city.salary_max}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  cityBox: {
    width: "90%",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
  },
  cityText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
