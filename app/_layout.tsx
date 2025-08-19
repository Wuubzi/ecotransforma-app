import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ToastManager from "toastify-react-native";
import "../global.css";

function AppContainer() {
  const { colorScheme } = useColorScheme();
  const [fontsLoaded] = useFonts({
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-Black": require("../assets/fonts/Outfit-Black.ttf"),
    "Outfit-ExtraBold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
    "Outfit-ExtraLight": require("../assets/fonts/Outfit-ExtraLight.ttf"),
    "Outfit-Thin": require("../assets/fonts/Outfit-Thin.ttf"),
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  return (
    <View className="flex-1 bg-backgroundWhite dark:bg-backgroundDark">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"}></StatusBar>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="+not-found"
          options={{ headerTransparent: true, headerTitle: "" }}
        />
        <Stack.Screen
          name="(ofertas)/OfertasDisponibles"
          options={{
            headerShadowVisible: false,
            headerTitle: "Ofertas Disponible",
          }}
        />
        <Stack.Screen
          name="(ofertas)/OfertasCanjear"
          options={{
            headerShadowVisible: false,
            headerTitle: "Confirmacion de Oferta",
          }}
        />
        <Stack.Screen
          name="(ofertas)/OfertasCanjeadas"
          options={{
            headerShadowVisible: false,
            headerTitle: "Oferta Canjeada",
          }}
        />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/verify-code"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(auth)/change-password"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(auth)/send-email"
          options={{ headerTransparent: true, headerTitle: "" }}
        />
      </Stack>
    </View>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppContainer />
      <ToastManager />
    </SafeAreaProvider>
  );
}
