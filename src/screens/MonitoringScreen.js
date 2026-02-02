import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import { useState, useEffect } from "react";

export default function MonitoringScreen({ navigation, route }) {
  const { userEmail } = route.params;

  // Keystrokes
  const [text, setText] = useState("");
  const [timeStamps, setTimestamps] = useState([]);
  const [intervals, setIntervals] = useState([]);

  // Touch Sensors
  const [touchStart, setTouchStart] = useState(null);
  const [touchDurations, setTouchDurations] = useState([]);

  // Accelerometer Sensors
  const [accData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [movementSamples, setMovementSamples] = useState([]);

  // Keystrokes
  const handleTextChange = (value) => {
    const now = Date.now();

    setTimestamps((prev) => {
      if (prev.length > 0) {
        const lastTime = prev[prev.length - 1];
        const diff = now - lastTime;

        setIntervals((prevIntervals) => [...prevIntervals, diff]);
      }
      return [...prev, now];
    });

    setText(value);
  };

  const averageInterval =
    intervals.length > 0
      ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
      : 0;

  // Touch Sensors
  const handlePressIn = () => {
    setTouchStart(Date.now());
  };

  const handlePressOut = () => {
    if (touchStart) {
      const duration = Date.now() - touchStart;
      setTouchDurations((prev) => [...prev, duration]);
      setTouchStart(null);
    }
  };

  const avgTouchDuration =
    touchDurations.length > 0
      ? Math.round(
          touchDurations.reduce((a, b) => a + b, 0) / touchDurations.length,
        )
      : 0;

  // Accelerometer Sensors
  useEffect(() => {
    Accelerometer.setUpdateInterval(1000); // 1 second

    const subscription = Accelerometer.addListener((data) => {
      // setAccelData(data);

      // const magnitude = Math.sqrt(
      //   data.x * data.x + data.y * data.y + data.z * data.z,
      // );

      // setMovementSamples((prev) => [...prev, magnitude]);
      setAccelData(data);

      setAxisSamples((prev) => ({
        x: [...prev.x, data.x],
        y: [...prev.y, data.y],
        z: [...prev.z, data.z],
      }));

      const magnitude = Math.sqrt(
        data.x * data.x + data.y * data.y + data.z * data.z,
      );

      setMovementSamples((prev) => [...prev, magnitude]);

      // Limit samples -- Same idea for axis samples if this runs long-term. (Above store unlimited samples)
      // const MAX_SAMPLES = 100;

      // setMovementSamples((prev) => [
      //   ...prev.slice(-MAX_SAMPLES + 1),
      //   magnitude,
      // ]);
    });

    return () => subscription.remove();
  }, []);

  const avgMovement =
    movementSamples.length > 0
      ? (
          movementSamples.reduce((a, b) => a + b, 0) / movementSamples.length
        ).toFixed(2)
      : 0;

  // Track per axis

  const [axisSamples, setAxisSamples] = useState({
    x: [],
    y: [],
    z: [],
  });

  const avg = (arr) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(3) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Continuous Authenticationn</Text>
      <Text>User: {userEmail}</Text>

      <TextInput
        style={styles.input}
        placeholder="Type continuously..."
        value={text}
        onChangeText={handleTextChange}
        multiline
      />

      <Text>Average keystroke interval: {averageInterval} ms</Text>

      <Text style={{ marginTop: 20 }}>Touch Behavior Area</Text>

      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchBox}
      >
        <Text>Tap or Hold Here</Text>
      </Pressable>

      <Text>Average touch duration: {avgTouchDuration} ms</Text>

      <Text style={{ marginTop: 5 }}>Avg device movement: {avgMovement}</Text>

      <Text style={{ marginTop: 5 }}>Accelerometer (real-time)</Text>
      <Text>X: {accData.x.toFixed(3)}</Text>
      <Text>Y: {accData.y.toFixed(3)}</Text>
      <Text>Z: {accData.z.toFixed(3)}</Text>

      <Text style={{ marginTop: 5 }}>Accelerometer averages</Text>
      <Text>Avg X: {avg(axisSamples.x)}</Text>
      <Text>Avg Y: {avg(axisSamples.y)}</Text>
      <Text>Avg Z: {avg(axisSamples.z)}</Text>
      <Text>Avg magnitude: {avgMovement}</Text>

      <Button title="Logout" onPress={() => navigation.replace("Login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    minHeight: 100,
    padding: 10,
    marginVertical: 12,
    borderRadius: 0,
  },
  touchBox: {
    height: 120,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 9,
    alignItems: "center",
    marginVertical: 12,
  },
});
