/* eslint-disable react-hooks/exhaustive-deps */
import Depositos from "@/components/Depositos";
import ScreenView from "@/components/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useFocusEffect, useRouter } from "expo-router";
import {
  CircleQuestionMarkIcon,
  MapPin,
  Moon,
  Recycle,
  Sun,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useCallback, useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { showLocation } from "react-native-map-link";

export default function HomeScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [idUser, setIdUser] = useState<number | null>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (idUser) {
        fetchUserData();
      }
    }, [idUser])
  );

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedId = await AsyncStorage.getItem("id_user");
        if (storedId) {

        setIdUser(parseInt(storedId));
        }
      } catch (error) {
        console.error("Error leyendo AsyncStorage:", error);
      }
    };

    loadUserId();
  }, []);
  const mostrarUbicacion = () => {
    showLocation({
      latitude: "10.94333541656095",
      longitude: "-74.7836217286596",
      title: "Sena Centro de aviacion",
      dialogTitle: "Abrir con",
      dialogMessage: "Elige una aplicacion",
      cancelText: "Cancelar",
      appsWhiteList: ["google-maps", "waze"],
    });
  };
  const abrirWhatsapp = () => {
    const numero = "573243471012";
    const mensaje = "Hola, Estoy interesado en reciclar";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    Linking.openURL(url).catch(() =>
      alert("Parece que WhatsApp no está instalado en este dispositivo.")
    );
  };

   const registrarEntrega = () => {
    const numero = "573243471012";
    const mensaje = "Hola, Quiero solicitar una recogida de reciclaje a mi domicilio/comunidad";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    Linking.openURL(url).catch(() =>
      alert("Parece que WhatsApp no está instalado en este dispositivo.")
    );
  };


  const fetchUserData = async (): Promise<{ name: string; points: number }> => {
    try {
      const respuesta = await fetch(
        `${apiUrl}/users/get-user?id_user=${idUser}`,
        {
          method: "GET",
        }
      );

      const data = await respuesta.json();
      const nombre = data.name;

      if (respuesta.ok) {
        setName(nombre.split(" ")[0]);
        setPoints(data.points);
        return {
          name: nombre.split(" ")[0],
          points: data?.points,
        };
      }
    } catch (error) {}
    return { name: "", points: 0 };
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
    if (idUser !== null) {
      const userData = await fetchUserData();
      setName(userData.name);
      setPoints(userData.points);
    }
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const isLogged = await AsyncStorage.getItem("isLogged");
      if (!isLogged) {
        router.replace("/login");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <ScreenView className="flex-1 bg-backgroundWhite dark:bg-backgroundDark">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#10B981", "#059669"]}
            tintColor={isDarkMode ? "#10B981" : "#059669"}
            title="Actualizando datos..."
            titleColor={isDarkMode ? "#ffffff" : "#000000"}
            progressBackgroundColor={isDarkMode ? "#1f2937" : "#ffffff"}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/*Header  */}
        <View className="flex-row items-center justify-between p-4">
          <View>
            <Text className="text-2xl text-black dark:color-white">
              Hey! {name}
            </Text>
          </View>
          <View className="p-2 border-2 border-gray-300 rounded-xl dark:border-gray-600 dark:color-white">
            <Pressable onPress={toggleColorScheme}>
              {isDarkMode ? (
                <Sun size={24} color="#fff" />
              ) : (
                <Moon size={24} color="#000" />
              )}
            </Pressable>
          </View>
        </View>

        {/* Points Cards */}
        <LinearGradient
          colors={isDarkMode ? ["#d2f5c0", "#6ec28d"] : ["#0d1f14", "#124a2c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            margin: 16,
            paddingVertical: 12,
          }}
        >
          {/* Points Cards Header*/}
          <View className="flex-row items-center gap-3 p-6">
            <Text className="text-xl font-semibold text-white dark:text-black">
              Puntos Obtenidos
            </Text>
            <CircleQuestionMarkIcon
              size={24}
              color={isDarkMode ? "#000" : "#fff"}
            />
          </View>

          {/* Points Cards Content */}
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-2">
              <Text className="text-4xl font-bold text-white dark:text-black">
                {points}
              </Text>
              <Text className="text-xl text-white dark:text-black">Puntos</Text>
            </View>

            <Link href={"/(tabs)/ofertas"} asChild>
              <Pressable className="border border-gray-500 px-5 py-3 rounded-full">
                <Text className="text-lg font-bold text-white dark:text-black">
                  Canjear
                </Text>
              </Pressable>
            </Link>
          </View>
        </LinearGradient>

        {/* Actions Cards */}
        <View className="flex-row items-center justify-around py-2 px-4 gap-4">
          <Pressable
            onPress={mostrarUbicacion}
            className="flex-col gap-4 bg-white rounded-xl shadow-md flex items-center p-6 dark:bg-[#010100] dark:shadow-gray-800"
          >
            <View className="p-4 border border-gray-300 rounded-xl">
              <MapPin color={isDarkMode ? "#fff" : "#000"} />
            </View>
            <Text className="text-md font-semibold font-outfitMedium dark:text-white">
              Entregar Reciclaje
            </Text>
          </Pressable>
          <Pressable
            onPress={abrirWhatsapp}
            className="flex-col gap-4 bg-white rounded-xl shadow-md flex items-center p-6 dark:bg-[#010100] dark:shadow-gray-800"
          >
            <View className="p-4 border border-gray-300 rounded-xl">
              <Recycle color={isDarkMode ? "#fff" : "#000"} />
            </View>
            <Text className="text-md font-semibold font-outfitMedium dark:text-white">
              ¿Como Reciclar?
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View>
          <Text className="text-2xl font-bold font-outfitMedium p-5 dark:text-white">
            Ultimos Depositos
          </Text>
          <View>
            <View className="max-h-40 overflow-scroll">
                <Depositos refreshKey={lastUpdate} />
            </View>
          </View>
        </View>

        <Pressable
         onPress={registrarEntrega}
        className="bg-[#010100] m-6 p-4 rounded-xl items-center justify-center dark:bg-white">
          <Text className="text-white text-xl font-outfitMedium dark:text-black">
            Registrar Entrega
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenView>
  );
}
