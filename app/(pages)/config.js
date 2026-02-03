import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "@react-native-firebase/firestore";

export default function Config() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Configurações</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(auth)/editarPerfil")}
      >
        <Text style={styles.textButton}>Editar Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(auth)/editarCredenciais")}
      >
        <Text style={styles.textButton}>
          Editar Credenciais (Zona de segurança)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(app)/telainicial")}
      >
        <Text style={styles.textButton}>Sair</Text>
      </TouchableOpacity>
      {/*Depois pesquisar como faz para apagar conta */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
    fontWeight: "500",
    color: "#1e66a6",
    fontFamily: "System",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 10,
    width: "75%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "System",
    marginBottom: 5,
  },
});
