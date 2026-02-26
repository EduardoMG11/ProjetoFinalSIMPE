import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EmpresaServico() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [servicos, setServicos] = useState([]);
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    async function carregarServicos() {
      const snap = await firestore()
        .collection("servicos")
        .where("usuario", "==", id)
        .get();

      const lista = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setServicos(lista);
    }
    carregarServicos();

    async function carregarEmpresa() {
      const snap = await firestore()
        .collection("usuariosPublico")
        .doc(id)
        .get();

      const empresa = snap.data();

      setEmpresa(empresa);
    }
    carregarEmpresa();
  }, [id]);

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={servicos}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <Text style={styles.text1}>
            Vendo os serviços da empresa: {empresa?.nomeNegocio}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.infoContainer}>
          <Text style={styles.text1}>Nome: {item.nome}</Text>

          <Text style={styles.descricao}>Descrição: {item.descricao}</Text>

          <Text style={styles.itemText}>Área: {item.area}</Text>

          <Text style={styles.itemText}>
            O que deseja em troca: {item.troca}
          </Text>

          <Text style={styles.itemText}>
            Disponibilidade:
            {item.disponivel ? " Disponível" : " Indisponível"}
          </Text>
        </View>
      )}
      ListFooterComponent={
        <View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.textButton}>
              Entre em contato com a empresa
            </Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const largura = Dimensions.get("window").width * 0.8;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    width: largura,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
});
