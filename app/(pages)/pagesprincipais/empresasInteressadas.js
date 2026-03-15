import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  FlatList,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

export default function EmpresasInteressadas() {
  const router = useRouter();
  const [empresas, setEmpresas] = useState([]);
  const user = useContext(AuthContext);

  useEffect(() => {
    const scraping = async () => {
      try {
        const find = await firestore()
          .collection("usuariosPublico")
          .where("interessadoEmpresa", "array-contains", user.uid)
          .get();
        const lista = find.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmpresas(lista);
      } catch (error) {
        Alert.alert("Erro ao encontrar empresas");
      }
    };
    scraping();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>
        Verifique as empresas interessadas em você!
      </Text>
      {empresas.length > 0 ? (
        <FlatList
          data={empresas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/empresas/${item.id}`)}
              style={styles.item}
            >
              <View style={styles.infoContainer}>
                <Text style={styles.itemText}>{item.nomeNegocio}</Text>
                <Text style={styles.descricao}>Área: {item.area}</Text>
                <Text style={styles.descricao}>Clique aqui para ver mais!</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.text1}>
          Nenhuma empresa interessada no momento.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e3e3",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  text1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    fontFamily: "System",
  },

  infoContainer: {
    width: "100%",
    maxWidth: 520,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },

  item: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
  },

  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    fontFamily: "System",
  },

  descricao: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
    fontFamily: "System",
    color: "#555",
  },

  listContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
});
