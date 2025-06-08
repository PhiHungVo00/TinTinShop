import { ITopping } from "@/types/backend";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS } from "@/util/constant";

const imagePlaceholder = require("@/assets/images/setting/avatar_default.jpg");

interface ItemToppingProps {
  topping: ITopping;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ItemTopping = ({ topping, onEdit, onDelete }: ItemToppingProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image
          source={topping.image ? { uri: topping.image } : imagePlaceholder}
          style={styles.image}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{topping.name}</Text>
          <Text style={styles.description}>{topping.price}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {onEdit && (
          <TouchableOpacity onPress={onEdit}>
            <AntDesign name="edit" size={24} color={COLORS.ITEM_TEXT} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete}>
            <AntDesign name="delete" size={24} color={COLORS.ITEM_TEXT} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    backgroundColor: COLORS.ITEM_BACKGROUND,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.ITEM_BORDER,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.ITEM_TEXT,
  },
  description: {
    fontSize: 12,
    color: COLORS.ITEM_TEXT,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
  },
});

export default ItemTopping;
