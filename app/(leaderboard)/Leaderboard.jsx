import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/leaderboard')
            .then(response => response.json())
            .then(data => setLeaderboard(data.leaderboard))
            .catch(error => console.error('Error fetching leaderboard:', error));
    }, []);

    return (
        <View style={styles.container}>
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
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
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
