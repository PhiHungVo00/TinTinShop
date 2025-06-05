import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '@/util/constant';
import { ICoupon } from '@/types/backend';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DiscountType } from '@/types/enums/DiscountType.enum';

interface ItemCouponProps {
    coupon: ICoupon;
    imageUri?: string;
    editPress?: () => void;
    deletePress?: () => void;
}

const ItemCoupon: React.FC<ItemCouponProps> = ({ 
    coupon, 
    imageUri, 
    editPress, 
    deletePress 
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = () => {
        const now = new Date();
        const endDate = new Date(coupon.endDate);
        
        if (!coupon.isActive) return COLORS.ERROR;
        if (endDate < now) return COLORS.WARNING;
        return COLORS.SUCCESS;
    };

    const getStatusText = () => {
        const now = new Date();
        const endDate = new Date(coupon.endDate);
        
        if (!coupon.isActive) return 'Không hoạt động';
        if (endDate < now) return 'Hết hạn';
        return 'Đang hoạt động';
    };

    const getDiscountText = () => {
        if (coupon.discountType === DiscountType.PERCENT) {
            return `${coupon.discountValue}%`;
        } else {
            return formatCurrency(coupon.discountValue);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.couponImage} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="ticket" size={32} color={COLORS.ITEM_TEXT} />
                    </View>
                )}
                
                <View style={styles.couponInfo}>
                    <Text style={styles.couponCode}>{coupon.code}</Text>
                    <Text style={styles.couponDescription} numberOfLines={2}>
                        {coupon.description}
                    </Text>
                    <Text style={styles.discountText}>
                        Giảm: <Text style={styles.discountValue}>{getDiscountText()}</Text>
                    </Text>
                    <Text style={styles.dateText}>
                        HSD: {formatDate(coupon.endDate)}
                    </Text>
                </View>
            </View>

            <View style={styles.rightSection}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                    <Text style={styles.statusText}>{getStatusText()}</Text>
                </View>
                
                <Text style={styles.quantityText}>SL: {coupon.quantity}</Text>
                
                <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={editPress} style={styles.editButton}>
                        <Ionicons name="pencil" size={20} color={COLORS.BLUE_LIGHT} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={deletePress} style={styles.deleteButton}>
                        <Ionicons name="trash" size={20} color={COLORS.ERROR} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.ITEM_BACKGROUND,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    leftSection: {
        flex: 1,
        flexDirection: 'row',
    },
    couponImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    placeholderImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: COLORS.BACKGROUND,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    couponInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    couponCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.ITEM_TEXT,
        marginBottom: 4,
    },
    couponDescription: {
        fontSize: 14,
        color: COLORS.ITEM_TEXT,
        opacity: 0.8,
        marginBottom: 4,
    },
    discountText: {
        fontSize: 14,
        color: COLORS.ITEM_TEXT,
    },
    discountValue: {
        fontWeight: 'bold',
        color: COLORS.SUCCESS,
    },
    dateText: {
        fontSize: 12,
        color: COLORS.ITEM_TEXT,
        opacity: 0.6,
    },
    rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        minWidth: 100,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 12,
        color: COLORS.ITEM_TEXT,
        opacity: 0.8,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: COLORS.BACKGROUND,
    },
    deleteButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: COLORS.BACKGROUND,
    },
});

export default ItemCoupon;