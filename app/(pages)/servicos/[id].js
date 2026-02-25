import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import Video from "react-native-video";
import Carousel from "react-native-reanimated-carousel";

export default function Servico() {
  const { id } = useLocalSearchParams();

  const [servico, setServico] = useState(null);
  const router = useRouter();

  const { width } = Dimensions.get("window");

  useEffect(() => {
    const listarServico = async () => {
      try {
        const serv = firestore().collection("servicos").doc(id);
        const doc = await serv.get();
        if (doc.exists) {
          setServico(doc.data());
        }
      } catch (error) {
        console.error("Erro ao buscar serviço:", error);
      }
    };
    listarServico();
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {servico && (
        <>
          <Text style={styles.title}>{servico.nome}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.descricao}>Descrição: {servico.descricao}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Área de atuação: {servico.area}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>
              O que espero em troca: {servico.troca}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Estado: {servico.estado}</Text>
          </View>
          <View style={styles.videoContainer}>
            <Video
              controls={true}
              source={{ uri: servico.video }}
              style={styles.video}
            />
          </View>

          {servico?.fotos?.length > 0 && (
            <Carousel
              loop
              width={width * 0.9}
              height={220}
              data={servico.fotos}
              autoPlay={true}
              autoPlayInterval={3000}
              scrollAnimationDuration={800}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: width * 0.9,
                    height: 220,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                </View>
              )}
            />
          )}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/servicos/apagar/" + id)}
            >
              <Text style={styles.textButton}>Apagar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/servicos/editar/" + id)}
            >
              <Text style={styles.textButton}>Editar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    width: "90%",
  },

  infoContainer: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    elevation: 3,
  },

  descricao: {
    fontSize: 16,
    textAlign: "center",
  },

  text: {
    fontSize: 15,
    textAlign: "center",
  },
  textButton: {
    fontSize: 15,
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    padding: 10,
    fontFamily: "System",
  },

  videoContainer: {
    width: "90%",
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  video: {
    width: "100%",
    height: "100%",
  },

  image: {
    width: "90%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: "cover",
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
    padding: 20,
  },
});
