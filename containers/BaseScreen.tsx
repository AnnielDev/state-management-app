import { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import Constants from "expo-constants";
interface Props {
  children: ReactNode;
  title?: string;
}
export default function BaseScreen({ children, title }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 20,
    backgroundColor:'#252b37'
  },
  title: {
    fontFamily: "bold",
    fontSize: 24,
  },
});
