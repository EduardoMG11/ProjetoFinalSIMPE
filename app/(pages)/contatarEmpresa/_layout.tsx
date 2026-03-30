import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppLayout() {
  const router = useRouter();
  /* define router e layout da página  */
  return <Stack screenOptions={{ headerTitle: "" }} />;
}
