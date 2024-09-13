import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { RootStackParamList } from "../types/Navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Colors from "../constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import useCartStore from "../stores/cart";

type Props = NativeStackScreenProps<RootStackParamList, "Product">;

const ios = Platform.OS === "ios";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const ProductScreen = ({ navigation, route }: Props) => {
  const { product } = route.params;
  const images = [
    require("../assets/productImage1.png"),
    require("../assets/productImage2.png"),
    require("../assets/productImage3.png"),
    require("../assets/productImage4.png"),
  ];
  const { addToCart, getTotalCartItems } = useCartStore();
  const totalItems = getTotalCartItems();
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      header: () => renderHeader(),
    });
  }, [totalItems]);

  const renderHeader = () => (
    <SafeAreaView style={{ marginTop: ios ? -10 : 30 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 5 }}
        >
          <FontAwesome6 name="chevron-left" size={22} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <FontAwesome6 name="opencart" size={20} color={Colors.primary} />
          {totalItems > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        >
          {images.map((item: any, index: number) => (
            <Image source={item} style={styles.productImage} key={index} />
          ))}
        </ScrollView>
        <View style={styles.dotContainer}>
          {images.map((_: any, i: number) => {
            const inputRange = [
              (i - 1) * windowWidth,
              i * windowWidth,
              (i + 1) * windowWidth,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 18, 8],
              extrapolate: "clamp",
            });
            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: [Colors.grey, Colors.dark, Colors.grey],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={i.toString()}
                style={[
                  styles.dot,
                  { width: dotWidth, backgroundColor: dotColor },
                ]}
              />
            );
          })}
        </View>
      </View>
      <View style={styles.details}>
        <Text style={styles.productName}>{product.title}</Text>
        <Text style={styles.mrp}>
          MRP <Text style={styles.productPrice}>₹{product.price}</Text>
        </Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButtons, { backgroundColor: Colors.dark }]}
          onPress={() => addToCart(product)}
        >
          <Text style={styles.footerButtonText}>Add To Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButtons}>
          <Text style={styles.footerButtonText}>Buy Now</Text>
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
    backgroundColor: "#fff",
    flex: 1,
  },
  badgeContainer: {
    position: "absolute",
    right: -12,
    top: -10,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  productImage: {
    width: windowWidth,
    height: windowHeight * 0.6,
    resizeMode: "cover",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  details: {
    padding: 10,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 5,
    alignSelf: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  productName: {
    fontSize: 0.08 * windowWidth,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 5,
  },
  mrp: {
    color: Colors.grey,
    fontSize: 0.04 * windowWidth,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 0.05 * windowWidth,
    color: Colors.primary,
  },
  productDescription: {
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    height: 0.1 * windowHeight,
    width: windowWidth,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  footerButtons: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    height: 0.05 * windowHeight,
    flex: 1,
    borderRadius: 10,
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 24,
  },
});

export default ProductScreen;
