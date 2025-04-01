import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Home({ navigation }) {
    const router = useRouter();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <StatusBar style="auto" />

        {/* Chapter Button */}
        <View style={styles.roundbox1}>
          <Text style={{ fontSize: 20, color: 'red', paddingTop: 0 }}>Progress</Text>
          <TouchableOpacity style={styles.chapterb} onPress={() =>router.replace('/(chapters)/chapters')}>
            <Text style={styles.buttonText}>Chapter</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
  {/* First Row */}
  <View style={styles.buttonRow}>
    <TouchableOpacity style={styles.circleb} onPress={() => router.replace('/(city-selection)/job-selection')}>
      <Icon name="money" size={60} color="black" />
      <Text style={styles.coursetext}>Jobs</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.circleb} onPress={() => router.replace('/(leaderboard)/Leaderboard')}>
      <MaterialCommunityIcons name="medal" size={60} color="black" />
      <Text style={styles.coursetext}>LeaderBoard</Text>
    </TouchableOpacity>
  </View>

  {/* Second Row */}
  <View style={styles.buttonRow}>
    <TouchableOpacity style={styles.circleb} onPress={() =>router.replace('/(city-selection)/city-selection')}>
      <Icon name="shopping-cart" size={60} color="black" />
      <Text style={styles.coursetext}>City Selection</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.circleb} onPress={() => router.replace('/(goals)/Addgoals')}>
      <MaterialCommunityIcons name="medal" size={60} color="black" />
      <Text style={styles.coursetext}>Goals</Text>
    </TouchableOpacity>
  </View>

  {/* Third Row */}
  <View style={styles.buttonRow}>
    <TouchableOpacity style={styles.circleb} onPress={() =>router.replace('/Stockpage')}>
      <MaterialCommunityIcons name="finance" size={60} color="black" />
      <Text style={styles.coursetext}>Stock Market</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.circleb} onPress={() => router.replace('/(chatbot)/chatbot')}>
      <Icon name="bullseye" size={60} color="black" />
      <Text style={styles.coursetext}>Chat</Text>
    </TouchableOpacity>
  </View>
</ScrollView>


        {/* Main Menu */}
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 20,
        alignItems: 'center',
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 20, // Space between rows
      },
      circleb: {
        backgroundColor: '#42A5F5',
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
      },
  safe: {
    flex: 1,
    backgroundColor: 'black',
    padding: '5%',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: '5%',
  },
  roundbox1: {
    width: '90%',
    height: 100,
    backgroundColor: '#90CAF9',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  chapterb: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coursetext: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: 'semi-bold',
    color: 'white',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  circleb: {
    backgroundColor: '#42A5F5',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttoncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    position: 'absolute',
    bottom: 20,
  },
  homeb: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 50,
  },
  leaderb: {
    backgroundColor: '#1565C0',
    padding: 15,
    borderRadius: 50,
  },
  chatb: {
    backgroundColor: '#0D47A1',
    padding: 15,
    borderRadius: 50,
  },
  settingsb: {
    backgroundColor: '#42A5F5',
    padding: 15,
    borderRadius: 50,
  },
});