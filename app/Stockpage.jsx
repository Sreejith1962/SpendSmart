// import React from 'react';
// import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
// import { Image } from 'react-native';
// import sample from '../assets/data/sample.json'
// import Stocklist from './Stocklist';
// import { TouchableOpacity } from 'react-native';

// export default function Stockpage({navigation}) {
//   const stocks=Object.values(sample);
// //   console.log(stocks)
//   return (
//     <>
//     <SafeAreaView edges={["top"]} style={{flex: 0, backgroundColor: '#E9FF78',justifyContent: 'center'}}>
//       <View style={{padding:20, paddingTop: 40}}>
//       <Image source={require('../assets/images/stocksicon.png')} style={{width: 50, height: 50}}/>
//       <Text style={{fontSize: 30, fontWeight: 'bold'}}>Stocks</Text>
//       </View>
//     </SafeAreaView>
//     <SafeAreaView edges={["bottom"]} style={{flex: 1,backgroundColor: 'black'}}>
//       <TouchableOpacity style={styles.container}>
//         <FlatList style={styles.fl}
//         data={stocks}
//         renderItem={({item})=><Stocklist stock={item}/>}
//         >
//         </FlatList>
//       </TouchableOpacity>
//       {/* </Link> */}
//     </SafeAreaView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000'
//   },
//   fl: {
//     padding: 10,
//   },
// });



import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import Stocklist from './Stocklist';
import { TouchableOpacity } from 'react-native';

export default function Stockpage({ navigation }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace with your Alpha Vantage API key
  const API_KEY = '354CYYVLNOSMXU7F';
  const symbols = ['RELIANCE.BSE', 'TATAPOWER.BSE', 'TCS.BSE', 'INFY.BSE', 'HDFCBANK.BSE'];

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const stockData = await Promise.all(
          symbols.map(async (symbol) => {
            const response = await fetch(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
            );
            const data = await response.json();
            console.log('data=',data)
            return {
              symbol: data['Global Quote']['01. symbol'],
              price: data['Global Quote']['05. price'],
              change: data['Global Quote']['09. change'],
              changePercent: data['Global Quote']['10. change percent'],
              date: data['Global Quote']['07. latest trading day'] // Extracting date
            };
          })
        );
        setStocks(stockData);
        console.log('sd',stockData)
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ flex: 0, backgroundColor: '#E9FF78', justifyContent: 'center' }}>
        <View style={{ padding: 20, paddingTop: 40 }}>
          <Image source={require('../assets/images/stocksicon.png')} style={{ width: 50, height: 50 }} />
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Stocks</Text>
        </View>
      </SafeAreaView>
      <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: 'black' }}>
        <TouchableOpacity style={styles.container}>
          <FlatList
            style={styles.fl}
            data={stocks}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => <Stocklist stock={item} />}
          />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fl: {
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});