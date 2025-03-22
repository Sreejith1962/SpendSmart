import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navbar from "./Navbar";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <Navbar/>
    </SafeAreaProvider>
  );
}
