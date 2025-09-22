import ScreenView from "@/components/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";

export default function Login() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    let valid = true;
    let newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El correo no es válido";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const logearse = async () => {
    if (!validate()) return;

    try {
      const respuesta = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        Toast.error(data.mensaje || "Credenciales inválidas");
        return;
      }
      await AsyncStorage.setItem("id_user", String(data.data?.id_user));
      await AsyncStorage.setItem("isLogged", data.access_token);
      Toast.success("✅ Has iniciado sesión correctamente. ¡Bienvenido!");
      router.replace("/");
    } catch (error) {
      console.log(error);
      Toast.error("Error al iniciar sesión");
    }
  };
  return (
    <ScreenView
      className="flex-1 bg-white"
      style={{ paddingTop: StatusBar.currentHeight }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mt-10 mb-10">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido de nuevo
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-2 mt-4">
              Email
            </Text>
            <TextInput
              className={`border rounded-xl px-4 py-4 text-base bg-gray-50 ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Ingresa tu email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
            )}

            <Text className="text-base font-semibold text-gray-900 mb-2 mt-4">
              Contraseña
            </Text>
            <View className="relative">
              <TextInput
                className={`border rounded-xl px-4 py-4 text-base bg-gray-50 pr-12 ${
                  errors.password ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
              />
              <Pressable
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text className="text-lg text-gray-600">
                  {showPassword ? "🙈" : "👁"}
                </Text>
              </Pressable>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.password}
              </Text>
            )}

            <View className="flex-row justify-end items-center mt-4 mb-6">
              <Link href={"/(auth)/send-email"} asChild>
                <Pressable>
                  <Text className="text-sm text-green-500 font-semibold">
                    Olvidaste tu Contraseña?
                  </Text>
                </Pressable>
              </Link>
            </View>

            <Pressable
              className="bg-green-500 rounded-xl py-4 items-center mb-6"
              onPress={logearse}
            >
              <Text className="text-white text-base font-semibold">
                Inicia Sesìon
              </Text>
            </Pressable>

            <View className="flex-row justify-center items-center">
              <Text className="text-sm text-gray-600">
                No tienes una cuenta?{" "}
              </Text>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text className="text-sm text-green-500 font-semibold">
                    Registrate
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenView>
  );
}
