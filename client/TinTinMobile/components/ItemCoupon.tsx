import { ICoupon } from "@/types/backend";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS } from "@/util/constant";

interface ItemCouponProps {
  coupon: ICoupon;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ItemCoupon = ({ coupon, onEdit, onDelete }: ItemCouponProps) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{coupon.code}</Text>
        {coupon.description && (
          <Text style={styles.description}>{coupon.description}</Text>
        )}
        <Text style={styles.description}>
          {coupon.discountType === 'PERCENT'
            ? `${coupon.discountValue}%`
            : `- ${coupon.discountValue}`}
        </Text>
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

export default ItemCoupon;
