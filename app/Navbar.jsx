import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Navbar() {
  return (
    <View style={styles.main}>
      <View style={styles.box}>
        <TouchableOpacity>
          <Link replace href="/">
            <MaterialCommunityIcons name="home" size={30} color="blue" />
          </Link>
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <TouchableOpacity>
          <Link replace href="/(goals)/Addgoals">
            <MaterialCommunityIcons name="bullseye-arrow" size={30} color="blue" />
          </Link>
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <TouchableOpacity>
          <Link replace href="/(city-selection)/city-selection">
            <MaterialCommunityIcons name="finance" size={30} color="blue" />
          </Link>
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
      <TouchableOpacity>
          <Link replace href="/(leaderboard)/Leaderboard">
            <MaterialCommunityIcons name="medal" size={30} color="blue" />
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    height: 62,
    width: "100%",
    backgroundColor: "black",
  },
  box: {
    flex: 1, 
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 2,
    borderColor: "blue",
    borderWidth: 0.5,
  },
  
});
