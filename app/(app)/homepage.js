import React from "react";
import { Text, StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TelaInicial() {
  const router = useRouter(); /* redirecionamento */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push("(pages)/pagesprincipais/perfil")}
          >
            <Image
              source={require("../../assets/perfil.png")}
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("(pages)/pagesprincipais/config")}
          >
            <Image
              source={require("../../assets/config.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.txtbox}>
          <Text style={styles.txtboasvindas}>Bem vindo de volta!</Text>
        </View>
        <View style={styles.atalhos}>
          <View
            style={{
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={styles.opcao}
              onPress={() => router.push("(pages)/pagesprincipais/regserv")}
            >
              <Image
                source={require("../../assets/servico.png")}
                style={{ width: 30, height: 30 }}
              />
              <Text style={styles.txtopcao}>Registrar Serviço</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.opcao}
              onPress={() =>
                router.push("(pages)/pagesprincipais/procuraServicos")
              }
            >
              <Image
                source={require("../../assets/pesquisa.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={styles.txtopcao}>Pesquisa de serviços</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: 15,
            }}
          >
            <TouchableOpacity
              style={styles.opcao}
              onPress={() =>
                router.push("(pages)/pagesprincipais/empresasInteressadas")
              }
            >
              <Image
                source={require("../../assets/empresa.png")}
                style={{ width: 35, height: 35 }}
              />
              <Text style={styles.txtopcao}>Empresas interessadas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.opcao}
              onPress={() =>
                router.push("(pages)/pagesprincipais/procuraEmpresa")
              }
            >
              <Image
                source={require("../../assets/procurarEmpresa.png")}
                style={{ width: 35, height: 35 }}
              />
              <Text style={styles.txtopcao}>Pesquisa de empresas</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View></View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() =>
            router.push("(pages)/plataformaEnsino/plataformaEnsino")
          }
        >
          <Image
            source={require("../../assets/plataformaensino.png")}
            style={{ width: 35, height: 35 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("(pages)/pagesprincipais/analise")}
        >
          <Image
            source={require("../../assets/analise.png")}
            style={{ width: 35, height: 35 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e3e3",
  },

  txtboasvindas: {
    fontSize: 30,
    fontWeight: "500",
    color: "#1e66a6",
    fontFamily: "System",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    textAlign: "left",
  },
  mainContent: {
    flex: 1, // Isso faz com que este bloco ocupe todo o espaço e empurre o footer para baixo
    paddingTop: 20, // Um leve espaçamento interno no topo se achar necessário
  },

  atalhos: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },

  opcao: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    elevation: 4,
  },

  txtopcao: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    fontFamily: "System",
    textAlign: "center",
    marginTop: 5,
  },

  funcionalidades: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 40,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 70,
  },
  txtbox: {
    paddingHorizontal: 20,
  },
});
