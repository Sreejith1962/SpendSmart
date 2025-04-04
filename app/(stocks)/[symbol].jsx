// import { View, Text } from 'react-native'
// import { StyleSheet } from 'react-native';
// import React from 'react'
// import { useLocalSearchParams } from 'expo-router'
// import sample from '../assets/data/sample.json';
// import Stocklist from './Stocklist';
// import Graph from '../components/Graph'
// import StockChart from '../components/StockChart';
// import StockChartnew from '../components/StockChartnew'

// const stock = () => {
//   const { symbol }=useLocalSearchParams();  
//   console.log('sb',symbol)
//   const stocks=sample[symbol];
//   if(!stocks){
//     return(
//       <Text style={{color: 'white'}}>Stock does not exist in database</Text>
//     )
//   }
//   return (
//     <>
//     <View style={styles.container}>
//       <Stocklist stock={stocks}/>
//       {/* <Graph></Graph> */}
//       <StockChartnew sname={stocks}></StockChartnew>
//     </View>
//     </>
//   )}


// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#000000',
//       padding: 10
//     },
//   });

// export default stock





import { View, Text, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Stocklist from './Stocklist';
import StockChartnew from './StockChartnew';

const Stock = () => {
  const { symbol } = useLocalSearchParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace with your Alpha Vantage API key
  const API_KEY = '354CYYVLNOSMXU7F';

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = await response.json();
        const stock = {
          symbol: data['Global Quote']['01. symbol'],
          price: data['Global Quote']['05. price'],
          change: data['Global Quote']['09. change'],
          changePercent: data['Global Quote']['10. change percent'],
        };
        setStockData(stock);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!stockData) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Stock data not available</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Stocklist stock={stockData} />
        <StockChartnew sname={stockData} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});

export default Stock;