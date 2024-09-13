import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";

const { width: windowWidth } = Dimensions.get("window");

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setSortOrder: (sortOrder: string) => void;
}

const SortModal = ({ visible, setVisible, setSortOrder }: Props) => {
  const handlePress = (order: string) => {
    setSortOrder(order);
    setVisible(false);
  };

  return (
    <Modal style={styles.container} isVisible={visible}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress("asc")}
      >
        <Text style={styles.buttonText}>Price - Low to High</Text>
      </TouchableOpacity>
      <View style={styles.separationLine} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress("desc")}
      >
        <Text style={styles.buttonText}>Price - High to Low</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setVisible(false)}
      >
        <Text style={styles.closeButtonText}>CLOSE</Text>
      </TouchableOpacity>
    </Modal>
  );
};

export default SortModal;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  separationLine: {
    width: "100%",
    height: 0.5,
    backgroundColor: Colors.dark,
    margin: 10,
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 0.04 * windowWidth,
  },
  closeButton: {
    marginVertical: 10,
    width: 0.25 * windowWidth,
    height: 0.1 * windowWidth,
    borderRadius: 0.05 * windowWidth,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark,
  },
  closeButtonText: {
    fontSize: 0.04 * windowWidth,
    color: "#fff",
  },
});
