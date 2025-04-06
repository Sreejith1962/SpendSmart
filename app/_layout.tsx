import { Stack, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BankBalance from "./bank_balance";

export default function RootLayout() {
  const pathname = usePathname();
  const [balance, setBalance] = useState<number | null>(null);

  // List of routes where components should not be shown
  const hideComponentsRoutes = ["/login", "/register"];

  const shouldShowComponents = !hideComponentsRoutes.includes(pathname);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const value = await AsyncStorage.getItem("balance");
        if (value !== null) {
          setBalance(parseFloat(value));
        }
      } catch (error) {
        console.log("Error fetching balance from AsyncStorage", error);
      }
    };

    fetchBalance();
  }, [pathname]); // refetch if user navigates after login

  return (
    <SafeAreaProvider>
       
      <View style={{ flex: 1 }}>
        
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>

        {shouldShowComponents && (
          <>
            {/* {balance !== null && <BankBalance balance={balance} />} */}
            <Navbar />
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}