import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BankBalance({ balance }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>💰 ₹{balance.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 5,
    zIndex: 999,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
