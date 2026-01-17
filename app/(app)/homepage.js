import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TelaInicial() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Bem vindo de volta!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    justifyContent: "space-between",
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
});
