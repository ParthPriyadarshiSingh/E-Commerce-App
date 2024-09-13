import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import Colors from "../constants/Colors";
import { HomeScreenNavigationProp } from "../types/Navigation";
import { Item } from "../types/Item";
import getAll from "../api/product.api";
import FilterModal from "./FilterModal";
import SortModal from "./SortModal";
import useCartStore from "../stores/cart";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const ios = Platform.OS === "ios";

interface Props {
  navigation: HomeScreenNavigationProp;
}
const HomeScreen = ({ navigation }: Props) => {
  const images = [
    require("../assets/productImage1.png"),
    require("../assets/productImage2.png"),
    require("../assets/productImage3.png"),
    require("../assets/productImage4.png"),
  ];

  const totalItems = useCartStore((state) => state.getTotalCartItems());

  const [searchActive, setSearchActive] = useState(false);
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Item[]>([]);
  const [minPrice, setMinPrice] = useState(0); // Minimum price for filter
  const [maxPrice, setMaxPrice] = useState(10000); // Maximum price for filter
  const [sortOrder, setSortOrder] = useState("asc"); // or "desc"
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    navigation.setOptions({
      header: () => renderHeader(),
    });
    const getProducts = async () => {
      try {
        const res = await getAll();
        setProducts(res);
        setFilteredProducts(res);
      } catch (error) {
        console.log("fetch error home screen", error);
      }
    };
    getProducts();
  }, [searchActive, totalItems]);
  useEffect(() => {
    // Filter products by price range
    const filtered = filterByPrice(products, minPrice, maxPrice);
    // Sort the filtered products by price
    if (isSorting) {
      const sorted = sortByPrice(filtered, sortOrder);
      setFilteredProducts(sorted);
    }
  }, [minPrice, maxPrice, sortOrder, products]);

  const renderHeader = () => (
    <SafeAreaView style={styles.headerContainer}>
      <View style={[styles.logoContainer, { flex: searchActive ? 1 : 0 }]}>
        {searchActive ? (
          <>
            <FontAwesome
              name="search"
              size={16}
              color={Colors.primary}
              style={{ position: "absolute", left: 0 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={Colors.grey}
              onChangeText={(text) => handleChange(text)}
              onBlur={() => {
                setSearchActive(false);
                setSearchResults([]);
              }}
            />
          </>
        ) : (
          <>
            <FontAwesome5 name="shopify" size={24} color={Colors.primary} />
            <Text style={styles.appName}>Shopping App</Text>
          </>
        )}
      </View>
      <View style={styles.logoContainer}>
        {searchActive ? (
          <TouchableOpacity
            onPress={() => {
              setSearchActive(false);
              setSearchResults([]);
            }}
          >
            <EvilIcons name="close" size={26} color={Colors.dark} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setSearchActive(true)}>
            <EvilIcons name="search" size={26} color={Colors.dark} />
          </TouchableOpacity>
        )}
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

  const filterByPrice = (
    products: Item[],
    minPrice: number,
    maxPrice: number
  ) => {
    return products.filter((product) => {
      const productPrice = product.price;
      return productPrice >= minPrice && productPrice <= maxPrice;
    });
  };

  const sortByPrice = (products: Item[], order: string) => {
    return products.sort((a, b) => {
      if (order === "asc") {
        return a.price - b.price;
      } else if (order === "desc") {
        return b.price - a.price;
      }
      return 0;
    });
  };

  const handleChange = (text: string) => {
    setQuery(text);
    const lowercasedQuery = text.toLowerCase();
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(lowercasedQuery)
    );
    setSearchResults(filtered);
  };

  const renderSearchResult = (item: Item, index: number) => (
    <TouchableOpacity
      style={[
        styles.searchResult,
        { borderBottomWidth: index === searchResults.length - 1 ? 0 : 1 },
      ]}
      onPress={() => navigation.navigate("Product", { product: item })}
    >
      <Text style={styles.searchItemTitle}>{item.title}</Text>
      <Text style={styles.searchItemPrice}>₹{item.price}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => navigation.navigate("Product", { product: item })}
    >
      <Image source={images[0]} style={styles.productImage} />
      <Text style={styles.productName}>{item.title}</Text>
      <Text style={styles.productPrice}>₹{item.price}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {searchActive && searchResults.length !== 0 && (
        <View style={styles.searchResultContainer}>
          <FlatList
            data={searchResults}
            renderItem={({ item, index }) => renderSearchResult(item, index)}
            keyExtractor={(item) => String(item.id)}
          />
        </View>
      )}
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
        />
      </View>
      <SortModal
        visible={sortVisible}
        setVisible={setSortVisible}
        setSortOrder={setSortOrder}
      />
      <FilterModal
        visible={filterVisible}
        setVisible={setFilterVisible}
        setMaxPrice={setMaxPrice}
        setMinPrice={setMinPrice}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButtons}
          onPress={() => {
            setSortVisible(true);
            setIsSorting(true);
          }}
        >
          <Text style={styles.footerButtonText}>SORT</Text>
          <MaterialCommunityIcons
            name="arrow-up-down"
            size={0.04 * windowWidth}
            color={Colors.dark}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButtons}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.footerButtonText}>FILTER</Text>
          <MaterialCommunityIcons
            name="tune-variant"
            size={0.04 * windowWidth}
            color={Colors.dark}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    marginTop: ios ? -10 : 30,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  logoContainer: {
    flexDirection: "row",
    marginHorizontal: 0.04 * windowWidth,
    justifyContent: "center",
    alignItems: "center",
    gap: 0.04 * windowWidth,
    padding: 5,
  },
  appName: {
    fontSize: 0.04 * windowWidth,
    fontWeight: "600",
    color: Colors.dark,
  },
  searchInput: {
    height: 0.07 * windowWidth,
    borderColor: Colors.grey,
    borderBottomWidth: 1,
    flex: 1,
    paddingLeft: 20,
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  searchResultContainer: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    top: 10,
    maxHeight: 0.3 * windowHeight,
    padding: 10,
    zIndex: 50,
    borderWidth: 1,
    borderColor: Colors.grey,
  },
  searchResult: {
    width: "100%",
    height: 0.1 * windowWidth,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderColor: Colors.primary,
    paddingHorizontal: 20,
  },
  searchItemTitle: {
    fontSize: 0.04 * windowWidth,
    color: Colors.dark,
  },
  searchItemPrice: {
    fontSize: 0.03 * windowWidth,
    color: Colors.primary,
  },
  listContent: {
    paddingVertical: 10,
    gap: 10,
  },
  productContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 5,
    width: windowWidth / 2 - 10,
  },
  productImage: {
    width: "100%",
    height: 0.6 * windowWidth,
    resizeMode: "cover",
    marginBottom: 5,
    borderRadius: 0.03 * windowWidth,
  },
  productName: {
    fontSize: 0.04 * windowWidth,
    fontWeight: "600",
    color: Colors.dark,
  },
  productPrice: {
    fontSize: 0.03 * windowWidth,
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    height: 0.07 * windowHeight,
    width: windowWidth,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 0.04 * windowHeight,
    flex: 1,
    borderRadius: 10,
  },
  footerButtonText: {
    color: Colors.dark,
    fontSize: 0.04 * windowWidth,
  },
});

export default HomeScreen;
