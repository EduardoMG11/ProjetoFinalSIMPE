import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function TelaRegistro() {
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);

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

      await firestore().collection("usuarios").doc(uid).set({
        nome,
        sobrenome,
        cnpj,
        telefone,
        endereco,
        nomeNegocio,
        area,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      alert("Conta criada com sucesso!");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    justifyContent: "space-between",
    paddingVertical: 80,
    paddingHorizontal: 30,
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
    marginTop: 5,
  },
  buttonText: {
    fontFamily: "System",
    fontSize: 16,
    color: "#6b6b9a",
  },
});
