import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import Navbar from '../Navbar';
import { API_URL } from '@/constants/api';


const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/leaderboard`)
            .then(response => response.json())
            .then(data => setLeaderboard(data.leaderboard))
            .catch(error => console.error('Error fetching leaderboard:', error));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            
        <View >
            <Text style={styles.heading}>Leaderboard</Text>
            <FlatList
                data={leaderboard}
                keyExtractor={(item) => item.rank.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.rank}>{item.rank}.</Text>
                        <Text style={styles.username}>{item.username}</Text>
                        <Text style={styles.points}>{item.experience_points} XP</Text>
                    </View>
                )}
                nestedScrollEnabled={true} 
            />
           
        </View>
            
        </KeyboardAvoidingView>
        </SafeAreaView>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:20,
        backgroundColor:'rgb(84, 170, 241)',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        elevation: 3,
    },
    rank: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    username: {
        fontSize: 18,
    },
    points: {
        fontSize: 18,
        color: '#007bff',
    },
});

export default Leaderboard;
