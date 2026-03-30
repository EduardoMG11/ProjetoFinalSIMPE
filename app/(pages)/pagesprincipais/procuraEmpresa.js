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

export default function ProcuraEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [filtro, setFiltro] = useState("nome");
  const [pesquisa, setPesquisa] = useState("");
  const user = useContext(AuthContext);
  const router = useRouter();
  /* lógica de busca de empresa  */
  useEffect(() => {
    if (!user || !user.uid) return;

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
  }, [pesquisa, filtro, user]);

  async function carregarServicos() {
    if (!user?.uid) return;

    const snapshot = await firestore()
      .collection("usuariosPublico")
      .where(firestore.FieldPath.documentId(), "!=", user.uid)
      .limit(100)
      .get();

    setEmpresas(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    );
  }

  async function buscarPorNome() {
    const buscaNome = await firestore()
      .collection("usuariosPublico")
      .orderBy("nomePesquisa")
      .startAt(pesquisa)
      .endAt(pesquisa + "\uf8ff")
      .get();

    atualizarLista(buscaNome);
  }

  async function buscarPorArea() {
    const buscaArea = await firestore()
      .collection("usuariosPublico")
      .orderBy("areaPesquisa")
      .startAt(pesquisa)
      .endAt(pesquisa + "\uf8ff")
      .get();

    atualizarLista(buscaArea);
  }

  async function buscarPorEstado() {
    const buscaEstado = await firestore()
      .collection("usuariosPublico")
      .orderBy("estadoPesquisa")
      .startAt(pesquisa)
      .endAt(pesquisa + "\uf8ff")
      .get();

    atualizarLista(buscaEstado);
  }

  function atualizarLista(snapshot) {
    const retirarUsuario = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((doc) => user.uid !== doc.id);

    setEmpresas(retirarUsuario);
  }
  /* conteúdo principal da página  */
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Procure por empresas para conectar</Text>

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

      <View style={styles.listWrapper}>
        <TextInput
          placeholder="Digite aqui para encontrar empresas para conectar"
          placeholderTextColor="#666666"
          value={pesquisa}
          onChangeText={(text) => setPesquisa(text.toLowerCase())}
          style={styles.input}
        />

        <FlatList
          data={empresas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.infoContainer}
              onPress={() => router.push(`/empresas/${item.id}`)}
            >
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.nomeNegocio}</Text>
                <Text style={styles.descricao}>Área: {item.areaPesquisa}</Text>
                <Text style={styles.descricao}>
                  Local: {item.estadoPesquisa}
                </Text>
                <Text style={styles.descricao}>
                  Empresa: {item.nomeNegocio}
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
  listWrapper: {
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
    minHeight: 120,
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
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
  actionButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
