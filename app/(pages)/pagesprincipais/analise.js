import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

export default function analise() {
  const user = useContext(AuthContext);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarUser = async () => {
      try {
        if (!user?.uid) return;

        const data = await firestore()
          .collection("usuariosPublico")
          .doc(user.uid)
          .get();

        if (data.exists) {
          setUsuario(data.data());
        }
      } catch (error) {
        Alert.alert("Erro", "Erro ao buscar dados do servidor.");
        console.error(error);
      }
    };

    carregarUser();
  }, [user]);

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Verifique seu uso no aplicativo!</Text>
      <View style={styles.caixaAnalise}>
        <Text style={styles.tituloAnalise}>
          Número de negociações que você se engajou:{" "}
        </Text>
        <Text style={styles.numeroAnalise}>{usuario.negociacoes}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e3e3",
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1e66a6",
    marginVertical: 20,
    textAlign: "left",
  },
  caixaAnalise: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tituloAnalise: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  numeroAnalise: {
    fontSize: 40,
    color: "#1e66a6",
    fontWeight: "bold",
  },
});
