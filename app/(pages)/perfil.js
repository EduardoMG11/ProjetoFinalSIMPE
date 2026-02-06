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

export default function Perfil() {
  const user = useContext(AuthContext);
  const router = useRouter();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
      if (!user) return;

      const snap = await firestore().collection("usuarios").doc(user.uid).get();

      if (snap.exists) {
        setPerfil(snap.data());
      }

      setLoading(false);
    }

    carregarPerfil();
  }, [user]);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!perfil) {
    return <Text>Perfil não encontrado</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: perfil.foto }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.text}>CNPJ: {perfil.cnpj}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Nome do negócio: {perfil.nomeNegocio}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>E-mail: {user.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Telefone: {perfil.telefone}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Endereço: {perfil.endereco}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Área de atuação: {perfil.area}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(auth)/editarPerfil")}
      >
        <Text style={styles.textButton}>Editar Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(pages)/servicosPessoais")}
      >
        <Text style={styles.textButton}>Veja seus serviços</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    fontFamily: "System",
    marginBottom: 5,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "System",
    marginBottom: 5,
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
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
    width: "75%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
});
