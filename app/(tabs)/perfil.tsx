/* eslint-disable react-hooks/exhaustive-deps */
import ScreenView from "@/components/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type UserDetail = {
  id_user: number;
  name: string;
  email: string;
  password: string;
  points: number;
  rol: string;
  createdAt: string;
  updatedAt: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [Name, setName] = useState("");
  const [Email, SetEmail] = useState("");
  const [idUser, setIdUser] = useState<string | null>(null);

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
          setIdUser(storedId);
        }
      } catch (error) {
        console.error("Error leyendo AsyncStorage:", error);
      }
    };

    loadUserId();
  }, []);

  const fetchUserData = async () => {
    try {
      const respuesta = await fetch(
        `http://192.168.1.11:3000/users/get-user?id_user=${idUser}`,
        {
          method: "GET",
        }
      );

      const data = await respuesta.json();

      if (respuesta.ok) {
        setName(data.name);
        SetEmail(data.email);
      }
    } catch (error) {}
  };

  const logout = async () => {
    const token = await AsyncStorage.getItem("isLogged");
    if (token) {
      AsyncStorage.removeItem("isLogged");
      router.replace("/(auth)/login");
    }
  };

  return (
    <ScreenView className="flex-1 bg-backgroundWhite dark:bg-backgroundDark">
      <View className="flex-1 px-4 pt-6">
        {/* Profile Picture Section */}
        <View className="items-center mb-8 ">
          <View className="w-20 h-20 bg-green-500 rounded-full mb-3" />
          <Pressable className="bg-white p-3 rounded-xl">
            <Text className="text-blue-500 text-base font-md font-outfitMedium">
              Editar foto de perfil
            </Text>
          </Pressable>
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          {/* nombre Field */}
          <Text className="text-base font-semibold text-gray-900 mb-2 mt-4 dark:text-white">
            Nombre
          </Text>
          <View className="relative">
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-4 text-base bg-gray-50 pr-12 "
              value={Name}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {/* email Field */}
          <Text className="text-base font-semibold text-gray-900 mb-2 mt-4 dark:text-white">
            Correo Electronico
          </Text>
          <View className="relative">
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-4 text-base bg-gray-50 pr-12"
              value={Email}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <Pressable
            onPress={logout}
            className="bg-[#010100] m-6 p-4 rounded-xl items-center justify-center dark:bg-white"
          >
            <Text className="text-white text-xl font-outfitMedium dark:text-black">
              Logout
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenView>
  );
}
