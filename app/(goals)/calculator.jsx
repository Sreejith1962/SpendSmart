import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import Navbar from '../Navbar';
import { API_URL } from '@/constants/api';



const App =  () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [growthRate, setGrowthRate] = useState(10);
  const [goals, setGoals] = useState([]);
  const [results, setResults] = useState(null);
  const [riskFreeRate,setRisk] = useState('0.04')
  
    
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchGoals = async () => {
        try {
          const userId = await AsyncStorage.getItem("user_id");
  
          if (!userId) {
            console.error("User ID not found in storage.");
            setLoading(false);
            return;
          }
  
          const response = await fetch(`${API_URL}/fetch_goals?user_id=${userId}`);
          const data = await response.json();
  
          if (response.ok) {
            setGoals(data.goals);
          } else {
            console.error("Error fetching goals:", data.error);
          }
        } catch (error) {
          console.error("Network error:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchGoals();
    }, []);

  const handleSubmit = async () => {
    const payload = {
      monthly_investment: parseFloat(monthlyInvestment),
      growth_rate: parseFloat(growthRate),
      riskFreeRate:parseFloat(riskFreeRate),
      goals: goals.map(goal => ({
        id:goal.id,
        title:goal.goal_name,
        target: parseFloat(goal.amount || 0), 
        years: parseInt(goal.year_of_completion || 0, 10)
      }))
    };

    try {
          const response = await axios.post(`${API_URL}/calculate`, payload);
          setResults(response.data);
          await AsyncStorage.setItem('portfolio_results', JSON.stringify(response.data));
          
    } catch (error) {
          console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
  const generateColor = (asset) => {
    if (asset === "GLD") {
      return "#FFD700";
    }
  
    const colors = ["#FFA726", "#66BB6A", "#29B6F6", "#AB47BC", "#FF7043"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  
   return (

    <SafeAreaView style={styles.container}>
        <ScrollView>
        <StatusBar style={'dark'}><Text>Hello</Text></StatusBar>
        <View >
        
          <View style={styles.interContainer}>
            <View style={styles.box2}>
              <Text style={styles.text2}>Monthly Investment:</Text>
              <TextInput style={[styles.textinput]}
                value={monthlyInvestment} 
                onChangeText={setMonthlyInvestment} 
                keyboardType="numeric" 
              />
            </View>
            <View style={styles.box2}>
                <Text style={styles.text2}>Increase in Investments(%):</Text>
                <TextInput 
                  value={growthRate} 
                  onChangeText={setGrowthRate} 
                  keyboardType="numeric" 
                  style={styles.textinput}
                />
            </View>
            
            
          </View>
          <View style={styles.pcontainer}>
      <Text style={styles.label}>Choose your Risk Factor</Text>
      <View style={styles.pickerContainer}>

          <Picker
          selectedValue={riskFreeRate}
          onValueChange={(itemValue) => setRisk(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Choose an option" value="" />
          <Picker.Item label="Low" value="0.08" />
          <Picker.Item label="Medium" value="0.04" />
          <Picker.Item label="High" value="0.01" />
        </Picker>
        </View>
    </View>
              <Pressable style ={styles.button}  onPress={handleSubmit} >
                <Text style={{padding:0,fontSize:19, color:'rgb(255, 255, 255)'}}>Can I Achieve My Goals ??</Text>
                </Pressable>
            
                <View>
      
    </View>
            
              {results && (
                <View>
                  <Text style={{ 
                    fontSize: 20, 
                    width:'91%', 
                    fontWeight: 'bold' ,
                    color:'rgb(28, 20, 20)',
                    backgroundColor:"rgb(91, 220, 235)",
                    textAlign:'center',
                    borderRadius:50,
                    margin:14,
                    padding:5
                    }}>Goals Status:</Text>
                  {results.goals_status.map((goalStatus, index) => (
                    
                            <View key={index} style={styles.goal}> 
                              <Text style={styles.goalTitle}>{goalStatus.goal.title}</Text>
                            <View style={styles.goalItem}>
                                
                                <View style={styles.detailsContainer}>
                                    <Text style={styles.goalText}>Amount</Text>
                                    <Text style={styles.goalText}>Time </Text>
                                    <Text style={styles.goalText}>Inflation Adjusted Target</Text>
                                  <Text style={styles.goalText}>Achievable</Text>
                               
                                </View>
                                
                                <View style={styles.detailsContainer}>
                                  <Text style={styles.goalText}>: {goalStatus.goal.target}</Text>
                                  <Text style={styles.goalText}>: {goalStatus.goal.years}</Text>
                               
                                  <Text style={styles.goalText}>: {goalStatus.inflation_adjusted_target}</Text>
                                  <Text style={styles.goalText}>: {goalStatus.achieved ? 'Yes':'No'}</Text>
                               
                                  </View>
                              </View>
                              </View> 
                  ))}

                  
                  
                  <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: '#FFFFFF' }}>Optimal Weights:</Text>
                  <View style={{ marginTop: 20 }}>
                    {Object.entries(results.optimal_weights).map(([asset, weight], index) => {
                   
                      const mappedAssetNames = {
                        "^BSESN": "BSE",
                        "^NSEI": "NSE",
                        "GLD": "GOLD",
                        "0P0001BB7Q.BO": "BONDS",
                      };
                      const displayName = mappedAssetNames[asset] || asset;

                      return (
                        <View key={index} style={{ marginBottom: 10 }}>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }}>
                            {displayName}: {(weight * 100).toFixed(2)}%
                          </Text>

                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <View
                              style={{
                                height: 20,
                                width: `${weight * 100}%`,
                                backgroundColor: generateColor(asset),
                                borderRadius: 5,
                              }}
                            />
                            <Text style={{ marginLeft: 10, color: '#FFFFFF' }}>{(weight * 100).toFixed(2)}%</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
                  )}

     </View>
  </ScrollView>
  <Navbar/>
</SafeAreaView>

  );
};

export default App;
const styles=StyleSheet.create({

    container: {
      padding: 0,
      backgroundColor: 'rgb(23, 9, 19)', 
      color: "#E8E8E8", 
      flex: 1,
  },
  text: {
      color: '#FFD700',
      paddingTop: 0,
      textAlign: 'center',
      fontSize: 17
  },
  text2: {
      color: 'black',
      paddingTop: 8,
      textAlign: 'center',
      fontSize: 17
  },
  textinput: {
      color: '#000000', 
      fontSize: 17,
      marginTop: 17,
      textAlign: 'center',
      borderColor: 'rgb(97, 13, 98)', 
      width: 115,
      borderRadius: 200,
      borderCurve: 'circular',
      borderWidth: 1,
      
      
  },
box2:{
        height:150,
        flex:1,
        backgroundColor:'#87CEEB',
        color:'black',
        padding:10,borderRadius:20,marginLeft:5,marginRight:5,alignItems:'center',textAlign:'center'
    },
  button: {
    
      backgroundColor: "#4E9FFF", 
      color: 'rgb(256,256,0)',
      padding: 8,
      borderRadius: 20,
      margin:14,width:'91%',
      alignItems: 'center',

      
      
  },
  interContainer: {
      flexDirection: 'row',
      height: 190,
      padding: 20
  },
  goal: {
      backgroundColor: '#FFFFFF', 
      color: '#000000', 
      marginBottom: 10,
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
      
  },
  goalItem: {
      flexDirection: "row",
      backgroundColor: 'white', 
      marginBottom: 10,
      borderRadius: 8,
      alignItems: "flex-start",
  },
  titleContainer: {
      flex: 1,
      flexDirection: "row"
  },
  detailsContainer: {
      flex: 1,
      width: 167,
      alignItems: 'flex-start'
  },
  goalTitle: {
      fontSize: 16,
      color: '#004B49', 
      fontWeight: "bold",
  },
  goalAmount: {
      fontSize: 14,
      color: "#6E6E6E", 
  },
  goalText: {
      fontSize: 14,
      color: "#00008B", 
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  pickerContainer: {
    
    borderWidth: 1,
    borderColor: '#6200EA',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: '#6200EA',
  },
  pcontainer: {
    
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight:20
  },
  
})