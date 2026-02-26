import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../context/AuthContext";

export default function RegistrarServico() {
  const [fotos, setFotos] = useState([]);
  const [video, setVideo] = useState(null);
  const [nomeServico, setNomeServico] = useState("");
  const [descricaoServico, setDescricaoServico] = useState("");
  const [areaServico, setAreaServico] = useState("");
  const [trocaServico, setTrocaServico] = useState("");
  const [estadoServico, setEstadoServico] = useState("");
  const [emNegociacao, setEmNegociacao] = useState(false);
  const [disponivel, setDisponivel] = useState(true);
  const [loading, setLoading] = useState(false);

  const user = useContext(AuthContext);

  const normalizar = (texto) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .trim();

  const adicionarFoto = (uri) => {
    setFotos((prev) => [...prev, uri].slice(0, 3));
  };

  const adicionarVideo = (uri) => {
    setVideo(uri);
  };

  const escolherFotoDaGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      adicionarFoto(result.assets[0].uri);
    }
  };

  const tirarFoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      adicionarFoto(result.assets[0].uri);
    }
  };

  const gravarVideo = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) {
      adicionarVideo(result.assets[0].uri);
    }
  };

  const escolherVideoDaGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) {
      adicionarVideo(result.assets[0].uri);
    }
  };

  const escolherFonteFoto = () => {
    Alert.alert("Adicionar foto", "Escolha a origem", [
      { text: "Câmera", onPress: tirarFoto },
      { text: "Galeria", onPress: escolherFotoDaGaleria },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const escolherFonteVideo = () => {
    Alert.alert("Adicionar vídeo", "Escolha a origem", [
      { text: "Câmera", onPress: gravarVideo },
      { text: "Galeria", onPress: escolherVideoDaGaleria },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const uploadFotoServico = async (uri, index) => {
    if (!user) throw new Error("Usuário não autenticado");
    const ref = storage().ref(
      `fotosServico/${user.uid}/foto_${Date.now()}_${index}.jpg`,
    );
    const response = await fetch(uri);
    const blob = await response.blob();
    await ref.put(blob);
    return await ref.getDownloadURL();
  };

  const videoServicoUrl = async (uri) => {
    if (!user) throw new Error("Usuário não autenticado");
    const ref = storage().ref(
      `videosServico/${user.uid}/video_${Date.now()}.mp4`,
    );
    const response = await fetch(uri);
    const blob = await response.blob();
    await ref.put(blob);
    return await ref.getDownloadURL();
  };

  const handleRegisterServico = async () => {
    setLoading(true);
    try {
      if (!user || !user.uid) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const fotosURL = await Promise.all(
        fotos.map((uri, index) => uploadFotoServico(uri, index)),
      );

      let videoURL = "";
      if (video) {
        videoURL = await videoServicoUrl(video);
      }

      if (fotos.length !== 3) {
        Alert.alert(
          "Fotos obrigatórias",
          "O serviço deve conter exatamente 3 fotos.",
        );
        return;
      }

      const nomePesquisa = normalizar(nomeServico);
      const areaPesquisa = normalizar(areaServico);
      const estadoPesquisa = normalizar(estadoServico);

      const dadosUsuario = await firestore()
        .collection("usuarios")
        .doc(user.uid)
        .get();

      const { nomeNegocio } = dadosUsuario.data();

      await firestore().collection("servicos").add({
        fotos: fotosURL,
        video: videoURL,
        nome: nomeServico,
        descricao: descricaoServico,
        area: areaServico,
        troca: trocaServico,
        estado: estadoServico,
        usuario: user.uid,
        nomeNegocio,
        emNegociacao,
        disponivel,
        nomePesquisa,
        areaPesquisa,
        estadoPesquisa,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert("Sucesso", "Serviço registrado com sucesso!");

      setFotos([]);
      setVideo(null);
      setNomeServico("");
      setDescricaoServico("");
      setAreaServico("");
      setTrocaServico("");
      setEstadoServico("");
      setEmNegociacao(false);
      setDisponivel(true);
    } catch (error) {
      console.error("Erro ao registrar serviço:", error);
      Alert.alert("Erro", "Erro ao registrar serviço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text1}>Registrar Serviço</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do serviço"
        value={nomeServico}
        onChangeText={setNomeServico}
        keyboardType="default"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição do serviço"
        value={descricaoServico}
        onChangeText={setDescricaoServico}
        keyboardType="default"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Área do serviço"
        value={areaServico}
        onChangeText={setAreaServico}
        keyboardType="default"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="O que você deseja em troca?"
        value={trocaServico}
        onChangeText={setTrocaServico}
        keyboardType="default"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Estado (UF) do serviço -> Ex.: (Rio de Janeiro)"
        value={estadoServico}
        onChangeText={setEstadoServico}
        autoCapitalize="words"
      />
      <TouchableOpacity onPress={escolherFonteFoto} style={styles.button}>
        <Text style={styles.txtbutton}>
          Escolher fotos do serviço ({fotos.length}/3)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={escolherFonteVideo}
        style={styles.button}
        disabled={loading}
      >
        <Text style={styles.txtbutton}>
          {video ? "Vídeo Selecionado" : "Escolher vídeo do serviço (1)"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegisterServico} style={styles.button}>
        <Text style={styles.txtbutton}>
          {loading ? "Carregando..." : "Registrar serviço"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  text1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    fontFamily: "System",
  },
  input: {
    width: "90%",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    placeholderTextColor: "#666666",
  },
  button: {
    width: "90%",
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
  },
  txtbutton: {
    fontFamily: "System",
    fontSize: 16,
    color: "#6b6b9a",
  },
});
