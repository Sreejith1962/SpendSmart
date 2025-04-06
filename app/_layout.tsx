import { Stack, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navbar from "./Navbar";

export default function RootLayout() {
  const pathname = usePathname();

  // List of routes where Navbar should NOT be shown
  const hideNavbarRoutes = ["/login", "/register"];

  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      {shouldShowNavbar && <Navbar />}
    </SafeAreaProvider>
  );
}
