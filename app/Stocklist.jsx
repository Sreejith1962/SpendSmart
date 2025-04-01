// import { View, Text } from 'react-native'
// import { StyleSheet} from 'react-native';
// import React from 'react'
// import { Link } from 'expo-router';
// import { Pressable } from 'react-native';

// export default function Stocklist({stock}) {
//     console.log('sk',stock)
//     const change=Number.parseFloat(stock.percent_change);
//   return (
//     <Link href={'/'+stock.symbol} asChild>
//         <Pressable style={styles.container}>
        
//             {/* Left container */}
//             <View style={{flex: 1}}>
//                 <Text style={styles.symbol}>{stock.symbol}</Text>
//                 <Text style={styles.name}>{stock.name}</Text>
//             </View>
//             {/* Right container */}
//             <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
//                 <Text style={styles.close}>{stock.close}</Text>
//                 <Text style={{color: change>0? 'green':'red', paddingTop: 5, fontSize: 15}}>{change>0?'+':''}{change}%</Text>
//             </View>
//         </Pressable>
//     </Link>
//   )
// }

// const styles=StyleSheet.create({
//     container: {
//         flexDirection: 'row',
//         paddingVertical: 10
//     },
//     symbol: {
//         fontSize: 20, 
//         fontWeight: 'bold', 
//         lineHeight:30,
//         color: 'blue'
//     },
//     name: {
//         color: 'gray',
//         lineHeight: 30,
//     },
//     close: {
//         color: 'white',
//         fontWeight: 'bold',
//         fontSize: 20 
//     }
// });



import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

export default function Stocklist({ stock }) {
  const change = Number.parseFloat(stock.changePercent); // Use changePercent from the API
  const changeValue = Number.parseFloat(stock.change); // Use change from the API

  return (
    <Link href={'/' + stock.symbol} asChild>
      <Pressable style={styles.container}>
        {/* Left container */}
        <View style={{ flex: 1 }}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.name}>{stock.symbol}</Text> {/* Use symbol as name for now */}
        </View>
        {/* Right container */}
        <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
          <Text style={styles.close}>₹{stock.price}</Text> {/* Use price from the API */}
          <Text style={{ color: change > 0 ? 'green' : 'red', paddingTop: 5, fontSize: 15 }}>
            {changeValue > 0 ? '+' : ''}
            {changeValue} ({change > 0 ? '+' : ''}
            {change}%)
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  symbol: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 30,
    color: 'blue',
  },
  name: {
    color: 'gray',
    lineHeight: 30,
  },
  close: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});