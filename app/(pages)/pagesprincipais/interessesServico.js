import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  Image,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

export default function InteressesServico() {
  const [servicos, setServicos] = useState([]);
  const user = useContext(AuthContext);
  const router = useRouter();

  const { width } = Dimensions.get("window");
  /* lógicas de remoção e busca de serviços que o usuário se interessou  */
  useEffect(() => {
    const listarServicos = async () => {
      try {
        const data = await firestore()
          .collection("usuariosPublico")
          .doc(user.uid)
          .get();

        const ids = data.data().interessadoServico || [];

        const lista = await Promise.all(
          ids.map(async (id) => {
            const doc = await firestore().collection("servicos").doc(id).get();

            return {
              id: doc.id,
              ...doc.data(),
            };
          }),
        );

        setServicos(lista);
      } catch (e) {
        Alert.alert("Erro ao buscar os serviços de interesse");
      }
    };
    listarServicos();
  }, [user]);

  const removerInteresse = async (item) => {
    try {
      const interesse = await firestore()
        .collection("usuariosPublico")
        .doc(user.uid);

      await interesse.update({
        interessadoServico: firestore.FieldValue.arrayRemove(item.id),
      });

      setServicos((prev) => prev.filter((serv) => serv.id !== item.id));
      Alert.alert("Interesse removido com sucesso!");
    } catch (e) {
      Alert.alert("Erro ao remover interesse: ", e);
    }
  };
  /* conteúdo principal da página  */
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>
        Verifique os serviços que você se interessou!
      </Text>
      {servicos.length > 0 ? (
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/othersServico/${item.id}`)}
              style={styles.item}
            >
              <View style={styles.infoContainer}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.itemText}>{item.nomeNegocio}</Text>
                  <TouchableOpacity onPress={() => removerInteresse(item)}>
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require("../../../assets/apagar.png")}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.descricao}>Área: {item.area}</Text>
                <Text style={styles.descricao}>Clique aqui para ver mais!</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.text1}>
          Você não se interessou por nenhum serviço até o momento.
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
