import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "react-native";

export const login = async (userId, accessToken) => {
  await AsyncStorage.setItem("user_id", userId);
  await AsyncStorage.setItem("access_token", accessToken);
};

export const logout = async () => {
  await AsyncStorage.clear();
};
export default function AuthScreen() {
    return (
      <View>
        <Text>Auth Screen</Text>
      </View>
    );
  }