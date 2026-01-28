import { createContext } from "react";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export const AuthContext = createContext<FirebaseAuthTypes.User | null>(null);
