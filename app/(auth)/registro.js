import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function TelaRegistro() {
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [endereco, setEndereco] = useState("");
  const [estado, setEstado] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [area, setArea] = useState("");
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const fotoPerfilUrl = async (uri) => {
    const user = auth().currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const ref = storage().ref(`users/${user.uid}/profile.jpg`);

    const response = await fetch(uri);
    const blob = await response.blob();

    await ref.put(blob);

    return await ref.getDownloadURL();
  };

  const normalizar = (texto) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .trim();

  const handleRegister = async () => {
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }
    try {
      setLoading(true);

      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        senha,
      );

      const uid = userCredential.user.uid;
      let fotoURL = null;

      if (foto) {
        fotoURL = await fotoPerfilUrl(foto);
      }
      const nomePesquisa = normalizar(nomeNegocio);
      const areaPesquisa = normalizar(area);
      const estadoPesquisa = normalizar(estado);

      await firestore().collection("usuarios").doc(uid).set({
        nome,
        sobrenome,
        cnpj,
        telefone,
        endereco,
        estado,
        nomeNegocio,
        area,
        email,
        foto: fotoURL,
        interessadoServico: [],
        interessadoEmpresa: [],
        nomePesquisa,
        areaPesquisa,
        estadoPesquisa,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      await firestore().collection("usuariosPublico").doc(uid).set({
        nome,
        sobrenome,
        telefone,
        endereco,
        estado,
        nomeNegocio,
        area,
        email,
        foto: fotoURL,
        interessadoServico: [],
        interessadoEmpresa: [],
        nomePesquisa,
        areaPesquisa,
        estadoPesquisa,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await auth().currentUser.sendEmailVerification();

      alert(
        "Conta criada com sucesso! Verifique sua caixa de entrada para verificar seu email. Se não aparecer, verifique sua caixa de spam.",
      );

      router.push("/(app)/homepage");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleFoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.text1}>
        Crie sua conta e conecte seu negócio a novas oportunidades.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="CNPJ"
        value={cnpj}
        onChangeText={setCnpj}
        keyboardType="default"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirme sua senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Nome do negócio"
        value={nomeNegocio}
        onChangeText={setNomeNegocio}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Estado"
        value={estado}
        onChangeText={setEstado}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Sobrenome"
        value={sobrenome}
        onChangeText={setSobrenome}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Área de atuação"
        value={area}
        onChangeText={setArea}
        autoCapitalize="words"
      />
      <View style={styles.viewButtons}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Selecionar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFoto}>
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Criando conta..." : "Entrar"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F7FB",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  text1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    fontFamily: "System",
  },
  input: {
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
  buttonText: {
    fontFamily: "System",
    fontSize: 16,
    color: "#6b6b9a",
  },
  viewButtons: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingBottom: 10,
  },
});
