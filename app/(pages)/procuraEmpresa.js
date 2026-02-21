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
import { AuthContext } from "../context/AuthContext";

export default function ProcuraEmpresas() {
  const [empresa, setEmpresa] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const user = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (pesquisa.length < 3) {
      carregarServicos();
      return;
    }

    if (filtro === "nome") buscarPorNome();
    if (filtro === "area") buscarPorArea();
    if (filtro === "estado") buscarPorEstado();
  }, [pesquisa, filtro]);

  async function carregarServicos() {
    const empresa = await firestore()
      .collection("usuariosPublico")
      .where(firestore.FieldPath.documentId(), "!=", user.uid)
      .limit(100)
      .get();

    setEmpresa(
      empresa.docs.map((doc) => ({
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

    const retirarUsuario = buscaNome.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((doc) => user.uid !== doc.id);
    setEmpresa(retirarUsuario);
  }

  async function buscarPorArea() {
    const buscaArea = await firestore()
      .collection("usuariosPublico")
      .orderBy("areaPesquisa")
      .startAt(pesquisa)
      .endAt(pesquisa + "\uf8ff")
      .get();

    const retirarUsuario = buscaArea.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((doc) => user.uid !== doc.id);
    setEmpresa(retirarUsuario);
  }
  async function buscarPorEstado() {
    const buscaEstado = await firestore()
      .collection("usuariosPublico")
      .orderBy("estadoPesquisa")
      .startAt(pesquisa)
      .endAt(pesquisa + "\uf8ff")
      .get();

    const retirarUsuario = buscaEstado.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((doc) => user.uid !== doc.id);
    setEmpresa(retirarUsuario);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Procure por empresas para conectar</Text>
      <View style={styles.filtroContainer}>
        <Text style={styles.filtro}>Pesquise por:</Text>
        <Pressable
          style={({ pressed }) => [
            styles.buttonBase,
            {
              backgroundColor: pressed ? "#434190" : "#5A67D8",
            },
          ]}
          onPress={() => setFiltro("area")}
        >
          <Text style={styles.filtroTexto}>Área</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.buttonBase,
            {
              backgroundColor: pressed ? "#434190" : "#5A67D8",
            },
          ]}
          onPress={() => setFiltro("nome")}
        >
          <Text style={styles.filtroTexto}>Nome</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.buttonBase,
            {
              backgroundColor: pressed ? "#434190" : "#5A67D8",
            },
          ]}
          onPress={() => setFiltro("estado")}
        >
          <Text style={styles.filtroTexto}>Localização</Text>
        </Pressable>
      </View>
      <View>
        <TextInput
          placeholder="Digite aqui para encontrar empresas para conectar"
          value={pesquisa}
          onChangeText={(text) => setPesquisa(text.toLowerCase())}
          style={styles.input}
        />
        <View>
          <FlatList
            data={empresa}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.infoContainer}
                onPress={() => router.push(`/empresas/${item.id}`)}
              >
                <View style={styles.item}>
                  <Text style={styles.itemText}>{item.nomeNegocio}</Text>
                  <Text style={styles.descricao}>
                    Área: {item.areaPesquisa}
                  </Text>
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
        <TouchableOpacity onPress={() => {}}>
          <Text>Botão</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    fontFamily: "System",
    color: "#333",
  },

  input: {
    width: 360,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
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
  buttonBase: {
    paddingVertical: 8,
    paddingHorizontal: 14,
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
