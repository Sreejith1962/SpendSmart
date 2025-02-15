import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{headerShown:true}}>
        <Stack.Screen name="index"/>
        <Stack.Screen name= "authentication"/>
        <Stack.Screen name="goals"/>
      </Stack>
    </SafeAreaProvider>
  );
}
