import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation, route }) {
  const { userEmail } = route.params;
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Welcome
      </Text>

      <Text>{userEmail}</Text>

      <Button
        title="Start Monitoring"
        onPress={() => navigation.navigate("Monitoring", { userEmail })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    // fontWeight: 'bold',
    marginBottom: 20,
  },
});
