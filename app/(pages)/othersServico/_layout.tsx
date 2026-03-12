import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{ headerTitle: "" }}/>
   
  );
}