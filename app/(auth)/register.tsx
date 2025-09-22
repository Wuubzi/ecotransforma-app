
import ScreenView from "@/components/Screen";
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

export default function Register() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  type RegisterErrors = {
    fullName?: string;
    email?: string;
    password?: string;
    terms?: string;
  };

  const [errors, setErrors] = useState<RegisterErrors>({});

  const validateRegisterForm = () => {
    let valid = true;
    let newErrors: RegisterErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "El nombre es obligatorio";
      valid = false;
    }

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
    } else if (password.length < 6) {
      newErrors.password = "Debe tener al menos 6 caracteres";
      valid = false;
    }

    if (!agreeTerms) {
      newErrors.terms = "Debes aceptar los términos y condiciones";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const register = async () => {
    if (!validateRegisterForm()) return;
    try {
      const respuesta = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          password: password,
        }),
      });
      if (respuesta.status === 409) {
        Toast.error("El email ya esta en uso");
      }

      if (respuesta.ok) {
        Toast.success(
          "🎉 ¡Te registraste con éxito! Inicia sesión y comienza a disfrutar."
        );

        router.replace("/(auth)/login");
      }
    } catch (error) {}
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
              Crea tu cuenta verde
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6">
              Gana recompensas mientras cuidas el medio ambiente.
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-2 mt-4">
              Nombre
            </Text>
            <TextInput
              className={`border rounded-xl px-4 py-4 text-base bg-gray-50 ${
                errors.fullName ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Ingresa tu nombre"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors({ ...errors, fullName: "" });
              }}
              placeholderTextColor="#9CA3AF"
            />
            {errors.fullName && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.fullName}
              </Text>
            )}
            <Text className="text-base font-semibold text-gray-900 mb-2 mt-4">
              Email
            </Text>
            <TextInput
              className={`border rounded-xl px-4 py-4 text-base bg-gray-50 ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Ingresa tu Correo Electrónico"
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

            <Pressable
              className="flex-row items-center mt-4 mb-6"
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <View
                className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
                  agreeTerms
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300"
                }`}
              >
                {agreeTerms && (
                  <Text className="text-white    text-xs font-bold">✓</Text>
                )}
              </View>
              <Text className="text-sm text-gray-600">
                Estoy de acuerdo con{" "}
                <Text className="text-green-500 font-semibold">
                  Terminos & Condiciones
                </Text>
              </Text>
            </Pressable>
            {errors.terms && (
              <Text className="text-red-500 text-sm mb-4">{errors.terms}</Text>
            )}

            <Pressable
              className="bg-green-500 rounded-xl py-4 items-center mb-6"
              onPress={register}
            >
              <Text className="text-white text-base font-semibold">
                Registrarte
              </Text>
            </Pressable>

            <View className="flex-row justify-center items-center">
              <Text className="text-sm text-gray-600">
                Ya tienes una cuenta?{" "}
              </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="text-sm text-green-500 font-semibold">
                    Inicia Sesìon
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
