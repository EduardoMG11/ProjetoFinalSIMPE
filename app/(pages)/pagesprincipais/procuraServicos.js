import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

export default function ProcuraServicos() {
  const [servicos, setServicos] = useState([]);
  const [filtro, setFiltro] = useState("nome");
  const [pesquisa, setPesquisa] = useState("");
  const user = useContext(AuthContext);
  const router = useRouter();
  /* procura de serviços  */
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (pesquisa.length < 3) {
        carregarServicos();
        return;
      }

      if (filtro === "nome") buscarPorNome();
      else if (filtro === "area") buscarPorArea();
      else if (filtro === "estado") buscarPorEstado();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [pesquisa, filtro]);

  async function carregarServicos() {
    const snapshot = await firestore().collection("servicos").limit(100).get();
    processarSnapshot(snapshot);
  }

  async function buscarPorNome() {
    const snapshot = await firestore()
      .collection("servicos")
      .orderBy("nomePesquisa")
      .startAt(pesquisa)
      .endAt(pesquisa + "\uf8ff")
      .get();
    processarSnapshot(snapshot);
  }

  async function buscarPorArea() {
    const snapshot = await firestore()
      .collection("servicos")
      .orderBy("areaPesquisa")
      .startAt(pesquisa)
      .endAt(pesquisa + "\uf8ff")
      .get();
    processarSnapshot(snapshot);
  }

  async function buscarPorEstado() {
    const snapshot = await firestore()
      .collection("servicos")
      .orderBy("estadoPesquisa")
      .startAt(pesquisa)
      .endAt(pesquisa + "\uf8ff")
      .get();
    processarSnapshot(snapshot);
  }

  function processarSnapshot(snapshot) {
    const dados = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((item) => item.usuario !== user.uid);
    setServicos(dados);
  }
  /* conteúdo principal da página  */
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Procure por serviços para sua empresa</Text>

      <View style={styles.filtroContainer}>
        <Text style={styles.filtro}>Pesquise por:</Text>
        <Pressable
          style={[
            styles.buttonBase,
            { backgroundColor: filtro === "area" ? "#434190" : "#5A67D8" },
          ]}
          onPress={() => setFiltro("area")}
        >
          <Text style={styles.filtroTexto}>Área</Text>
        </Pressable>

        <Pressable
          style={[
            styles.buttonBase,
            { backgroundColor: filtro === "nome" ? "#434190" : "#5A67D8" },
          ]}
          onPress={() => setFiltro("nome")}
        >
          <Text style={styles.filtroTexto}>Nome</Text>
        </Pressable>

        <Pressable
          style={[
            styles.buttonBase,
            { backgroundColor: filtro === "estado" ? "#434190" : "#5A67D8" },
          ]}
          onPress={() => setFiltro("estado")}
        >
          <Text style={styles.filtroTexto}>Local (UF)</Text>
        </Pressable>
      </View>

      <View style={styles.mainContent}>
        <TextInput
          placeholder="Procure serviços para sua empresa"
          placeholderTextColor="#666666"
          value={pesquisa}
          onChangeText={(text) => setPesquisa(text.toLowerCase())}
          style={styles.input}
        />

        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.infoContainer}
              onPress={() => router.push(`/othersServico/${item.id}`)}
            >
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.nome}</Text>
                <Text style={styles.descricao}>Área: {item.areaPesquisa}</Text>
                <Text style={styles.descricao}>
                  Local: {item.estadoPesquisa}
                </Text>
                <Text style={styles.descricao}>
                  Empresa: {item.nomeNegocio}
                </Text>
                <Text style={styles.descricao}>
                  Disponível: {item.disponivel ? "Sim" : "Não"}
                </Text>
              </View>
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
    backgroundColor: "#e3e3e3",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  text1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  filtroContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 520,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  filtro: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  mainContent: {
    flex: 1,
    width: "100%",
    maxWidth: 520,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  infoContainer: {
    width: "100%",
    minHeight: 130,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  item: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  descricao: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
    color: "#555",
  },
  listContent: {
    paddingBottom: 20,
  },
  buttonBase: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  filtroTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
