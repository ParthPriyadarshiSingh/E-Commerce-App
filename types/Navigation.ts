import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Item } from "./Item";

export type RootStackParamList = {
  Home: undefined;
  Product: { product: Item };
  Cart: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;
export type ProductScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Product"
>;
export type CartScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Cart"
>;
