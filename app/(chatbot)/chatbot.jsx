import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '@/constants/api';


export default function App () {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false); 

  const sendMessage = async () => {
    if (!message.trim()) return;

    setConversation([...conversation, { role: 'user', content: message }]);
    setLoading(true); 
    const userMessage = message;
    setMessage('');

    try {
      const response = await axios.post(   `${API_URL}/chat`, { message: userMessage });
      setConversation(prev => [
        ...prev,
        { role: 'assistant', content: response.data.response }
      ]);
    } catch (error) {
      console.error('API Error:', error);
      setConversation(prev => [
        ...prev,
        { role: 'assistant', content: '⚠ Failed to get response. Please try again.' }
      ]);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💸 FinBot - Your Financial Assistant</Text>

      <ScrollView style={styles.chatBox}>
        {conversation.map((msg, index) => (
          <View
            key={index}
            style={msg.role === 'user' ? styles.userMessage : styles.botMessage}
          >
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}

        {loading && (
          <View style={styles.botMessage}>
            <Text style={styles.messageText}>FinBot is typing...</Text>
            <ActivityIndicator size="small" color="#333" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Ask a financial question..."
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={sendMessage}
        />
        <Button title="Send" onPress={sendMessage} color="#28a745" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f1f2f6' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3542',
    textAlign: 'center',
    marginBottom: 20,
  },
  chatBox: { flex: 1, marginBottom: 15 },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#dfe4ea',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  messageText: { color: '#2f3542', fontSize: 16 },
  inputArea: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderColor: '#ced6e0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginRight: 10,
    fontSize: 16,
  },
});

