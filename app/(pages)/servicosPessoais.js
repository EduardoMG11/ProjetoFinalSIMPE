import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";

export default function ServicosPessoais() {
  const user = useContext(AuthContext);
  const router = useRouter();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarServicos() {
      if (!user) return;

      const snap = await firestore()
        .collection("servicos")
        .where("usuario", "==", user.uid)
        .get();

      const lista = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setServicos(lista);

      setLoading(false);
    }

    carregarServicos();
  }, [user]);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (servicos.length === 0) {
    return <Text>Serviços não encontrados</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Seus serviços</Text>
      <View style={styles.infoContainer}>
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/servicos/${item.id}`)}
              style={styles.item}
            >
              <Text style={styles.itemText}>{item.nome}</Text>
              <Text style={styles.descricao}>{item.descricao}</Text>
              <Text>Clique aqui para ver todas as informações!</Text>
            </TouchableOpacity>
          )}
        />
      </View>
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
  item: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    fontFamily: "System",
  },
  descricao: {
    fontSize: 15,
    fontWeight: "medium",
    marginBottom: 5,
    fontFamily: "System",
  },
});
