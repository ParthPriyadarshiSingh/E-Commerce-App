import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";

const { width: windowWidth } = Dimensions.get("window");

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
}

const FilterModal = ({
  visible,
  setVisible,
  setMinPrice,
  setMaxPrice,
}: Props) => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);

  const handleFilter = () => {
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
    setVisible(false);
  };

  return (
    <Modal isVisible={visible}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Filter by Price</Text>

        <Text style={styles.priceText}>
          {" "}
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </Text>

        {/* Slider to select price */}
        <MultiSlider
          values={priceRange}
          sliderLength={windowWidth * 0.7}
          min={0}
          max={5000}
          step={50}
          onValuesChange={(values) => setPriceRange(values)}
          selectedStyle={styles.selectedStyle}
          unselectedStyle={styles.unselectedStyle}
          trackStyle={styles.trackStyle}
          markerStyle={styles.markerStyle}
        />

        <TouchableOpacity style={styles.button} onPress={handleFilter}>
          <Text style={styles.buttonText}>Apply Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.grey }]}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: windowWidth * 0.8,
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  priceText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    height: 0.1 * windowWidth,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedStyle: {
    backgroundColor: Colors.primary,
  },
  unselectedStyle: {
    backgroundColor: "#d3d3d3",
  },
  trackStyle: {
    height: 4,
  },
  markerStyle: {
    backgroundColor: Colors.primary,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
});

export default FilterModal;
