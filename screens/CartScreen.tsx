import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { CartScreenNavigationProp } from "../types/Navigation";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import Colors from "../constants/Colors";
import useCartStore from "../stores/cart";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const ios = Platform.OS === "ios";

interface Props {
  navigation: CartScreenNavigationProp;
}

const CartScreen = ({ navigation }: Props) => {
  const images = [
    require("../assets/productImage1.png"),
    require("../assets/productImage2.png"),
    require("../assets/productImage3.png"),
    require("../assets/productImage4.png"),
  ];
  const { cart, removeFromCart, clearCart, getTotalPrice, loadCart } =
    useCartStore();

  useEffect(() => {
    navigation.setOptions({
      header: () => renderHeader(),
    });
    loadCart(); // Load cart data from AsyncStorage when app starts
  }, []);

  const renderHeader = () => (
    <SafeAreaView style={{ marginTop: ios ? -10 : 30 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome6 name="chevron-left" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image source={images[0]} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.size}>
          Size:<Text style={{ color: Colors.primary }}>M </Text> Quantity:
          <Text style={{ color: Colors.primary }}>{item.quantity}</Text>
        </Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <EvilIcons name="close" size={26} color={Colors.dark} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty</Text>
      ) : (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => clearCart()}
        >
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </TouchableOpacity>
      )}

      <View style={{ flex: 1, paddingBottom: 0.1 * windowHeight }}>
        <FlatList
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.footer}>
        {cart.length !== 0 && (
          <View style={styles.totalAmountContainer}>
            <Text style={styles.totalPrice}>Total Amount</Text>
            <Text style={[styles.totalPrice, { color: Colors.primary }]}>
              ₹{getTotalPrice()}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.clearButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
  },
  emptyCart: {
    fontSize: 0.08 * windowWidth,
    color: Colors.primary,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
  },
  clearButton: {
    margin: 20,
    flex: 1,
    maxHeight: 0.05 * windowHeight,
    minHeight: 0.05 * windowHeight,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: Colors.dark,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  cartItem: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  productImage: {
    width: windowWidth * 0.3,
    height: windowHeight * 0.2,
    resizeMode: "cover",
  },
  productDetails: {
    gap: 5,
    flex: 1,
    justifyContent: "space-evenly",
  },
  productName: {
    fontSize: 0.06 * windowWidth,
    fontWeight: "600",
    color: Colors.dark,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  size: {
    color: Colors.grey,
    fontSize: 0.035 * windowWidth,
    fontWeight: "700",
  },
  productPrice: {
    fontSize: 0.045 * windowWidth,
    color: Colors.primary,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  totalAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  totalPrice: {
    fontSize: 0.05 * windowWidth,
    fontWeight: "700",
  },
  footer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingBottom: 20,
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
  },
  buyButton: {
    height: 0.05 * windowHeight,
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CartScreen;
