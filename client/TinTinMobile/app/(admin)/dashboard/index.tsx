import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { callGetOrders, callGetProductById, callGetProducts, callGetToppings, callGetUsers } from '@/config/api';
import { IOrderRes } from '@/types/order';
import { OrderStatus } from '@/types/enums/OrderStatus.enum';
import { IProductResponseDTO } from '@/types/product';
import { ITopping, IUser } from '@/types/backend';
import { ToppingStatus } from '@/types/enums/ToppingStatus.enum';
import { COLORS } from '@/util/constant';

const screenWidth = Dimensions.get('window').width;

interface CustomerWithStats extends IUser {
  orderCount: number;
  totalSpent: number;
}

interface DashboardStats {
  totalOrders: number;
  monthlyRevenue: number;
  totalProducts: number;
  totalToppings: number;
  totalUsers: number;
}

interface TopProduct {
  id: string;
  name: string;
  quantity: number;
}

interface TopCustomer {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
}

interface ChartData {
  labels: string[];
  datasets: [{
    data: number[];
  }];
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    monthlyRevenue: 0,
    totalProducts: 0,
    totalToppings: 0,
    totalUsers: 0,
  });
  const [expandedProducts, setExpandedProducts] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('month');
  const [revenueChartData, setRevenueChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (chartPeriod) {
      fetchRevenueChart();
    }
  }, [chartPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchOrderStats(),
        fetchProductStats(),
        fetchUserStats(),
        fetchTopProducts(),
        fetchTopCustomers(),
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchOrderStats(),
        fetchProductStats(),
        fetchUserStats(),
        fetchTopProducts(),
        fetchTopCustomers(),
      ]);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
      Alert.alert('Lỗi', 'Không thể làm mới dữ liệu');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchOrderStats = async () => {
    const response = await callGetOrders({});
    if (response.data) {
      const orders = response.data;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
     
      const completedOrders = orders.filter((order: IOrderRes) => {
        const orderDate = new Date(order.createdAt || '');
        return (
          order.status === OrderStatus.COMPLETED &&
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear
        );
      });

      const monthlyRevenue = completedOrders.reduce(
        (sum: number, order: IOrderRes) => sum + order.finalPrice,
        0
      );

      setStats(prev => ({
        ...prev,
        totalOrders: completedOrders.length,
        monthlyRevenue,
      }));
    }
  };

  const fetchProductStats = async () => {
    const [productsResponse, toppingsResponse] = await Promise.all([
      callGetProducts({}),
      callGetToppings({}),
    ]);

    if (productsResponse.data && toppingsResponse.data) {
      const activeProducts = productsResponse.data.filter(
        (product: IProductResponseDTO) => product.active === true
      );
     
      const activeToppings = toppingsResponse.data.filter(
        (topping: ITopping) => topping.status === ToppingStatus.ACTIVE
      );

      setStats(prev => ({
        ...prev,
        totalProducts: activeProducts.length,
        totalToppings: activeToppings.length,
      }));
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await callGetUsers({});
      
      if (response && response.data && response.data.result) {
        setStats(prev => ({
          ...prev,
          totalUsers: response.data?.result.length || 0,
        }));
      } 
      else {
        console.warn('Unexpected users API response structure:', response);
        setStats(prev => ({
          ...prev,
          totalUsers: 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setStats(prev => ({
        ...prev,
        totalUsers: 0,
      }));
    }
  };

  const fetchTopProducts = async () => {
    try {
      const ordersResponse = await callGetOrders({});
      if (ordersResponse.data) {
        const completedOrders = ordersResponse.data.filter(
          (order: IOrderRes) => order.status === OrderStatus.COMPLETED
        );

        const productQuantities: { [key: string]: number } = {};
       
        for (const order of completedOrders) {
          if (order.orderDetails && Array.isArray(order.orderDetails)) {
            for (const detail of order.orderDetails) {
              const productId = detail.productId || detail.productSizeId;
              if (productId) {
                if (productQuantities[productId]) {
                  productQuantities[productId] += detail.quantity;
                } else {
                  productQuantities[productId] = detail.quantity;
                }
              }
            }
          }
        }

        const sortedProducts = Object.entries(productQuantities)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);

        const topProductsData: TopProduct[] = [];
        for (const [productId, quantity] of sortedProducts) {
          try {
            const productResponse = await callGetProductById(productId);
            if (productResponse.data) {
              topProductsData.push({
                id: productResponse.data.id,
                name: productResponse.data.name,
                quantity,
              });
            }
          } catch (error) {

          }
        }

        setTopProducts(topProductsData);
      }
    } catch (error) {
      console.error('Error fetching top products:', error);
    }
  };

  const fetchTopCustomers = async () => {
    try {

      
      const usersResponse = await callGetUsers({});

      
      if (!usersResponse.data) {
        console.warn('Missing users data in API response');
        setTopCustomers([]);
        return;
      }
  
      let users: IUser[] = [];
      if (usersResponse.data.result && Array.isArray(usersResponse.data.result)) {
        users = usersResponse.data.result;
      } else if (Array.isArray(usersResponse.data)) {
        users = usersResponse.data;
      } else {
        console.warn('Unexpected users API response structure:', usersResponse.data);
        setTopCustomers([]);
        return;
      }
      
      
      if (users.length === 0) {
        setTopCustomers([]);
        return;
      }
      
      const customersWithStats: CustomerWithStats[] = [];
      
      for (const user of users) {
        try {
          const ordersResponse = await callGetOrders({ filter: `user.id:${user.id}` });
          
          if (!ordersResponse?.data) {
            console.warn(`Missing orders data for user ${user.id}`);
            customersWithStats.push({
              ...user,
              orderCount: 0,
              totalSpent: 0
            });
            continue;
          }
          
          const completedOrders = ordersResponse.data.filter(
            (order: IOrderRes) => order.status === OrderStatus.COMPLETED
          );
          
          const orderCount = completedOrders.length;
          const totalSpent = completedOrders.reduce(
            (sum: number, order: IOrderRes) => sum + (order.finalPrice || order.totalPrice || 0),
            0
          );
          
          customersWithStats.push({
            ...user,
            orderCount,
            totalSpent
          });
        } catch (error) {
          console.warn(`Error fetching orders for user ${user.id}:`, error);
          customersWithStats.push({
            ...user,
            orderCount: 0,
            totalSpent: 0
          });
        }
      }
      
      const sortedCustomers = customersWithStats
        .sort((a, b) => {
          if (b.orderCount !== a.orderCount) {
            return b.orderCount - a.orderCount;
          }
          return b.totalSpent - a.totalSpent;
        })
        .slice(0, 5)
        .map(customer => ({
          id: customer.id || '',
          name: customer.name || 'Unknown User',
          email: customer.email || 'No email',
          orderCount: customer.orderCount,
          totalSpent: customer.totalSpent
        }));
      
      setTopCustomers(sortedCustomers);
    } catch (error) {
      console.error('Error fetching top customers:', error);
      setTopCustomers([]);
    }
  };

  const fetchRevenueChart = async () => {
    try {
      const response = await callGetOrders({});
      if (response.data) {
        const completedOrders = response.data.filter(
          (order: IOrderRes) => order.status === OrderStatus.COMPLETED
        );

        const chartData = generateChartData(completedOrders, chartPeriod);
        setRevenueChartData(chartData);
      }
    } catch (error) {
      console.error('Error fetching revenue chart:', error);
    }
  };

  const generateChartData = (orders: IOrderRes[], period: 'week' | 'month'): ChartData => {
    const now = new Date();
    const labels: string[] = [];
    const data: number[] = [];

    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('vi-VN', { weekday: 'short' }));
       
        const dayRevenue = orders
          .filter(order => {
            const orderDate = new Date(order.createdAt || '');
            return orderDate.toDateString() === date.toDateString();
          })
          .reduce((sum, order) => sum + order.finalPrice, 0);
       
        data.push(dayRevenue / 1000);
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        labels.push(date.toLocaleDateString('vi-VN', { month: 'short' }));
       
        const monthRevenue = orders
          .filter(order => {
            const orderDate = new Date(order.createdAt || '');
            return (
              orderDate.getMonth() === date.getMonth() &&
              orderDate.getFullYear() === date.getFullYear()
            );
          })
          .reduce((sum, order) => sum + order.finalPrice, 0);
       
        data.push(monthRevenue / 1000);
      }
    }

    return {
      labels,
      datasets: [{ data: data.map(val => val || 0) }],
    };
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleProductPress = (productId: string) => {
    router.push({
        pathname: '/management/products/ProductDetail',
        params: {
            id: productId
        }
    })
  };

  const handleCustomerPress = (customerId: string) => {
    router.push({
        pathname: '/management/orders/OrderUser',
        params: {
            id: customerId
        }
    })
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: string;
    gradient: string[];
    onPress?: () => void;
    expandable?: boolean;
    expanded?: boolean;
  }> = ({ title, value, icon, gradient, onPress, expandable, expanded }) => (
    <TouchableOpacity
      style={[styles.statCard]}
      onPress={onPress}
      disabled={!expandable}
      activeOpacity={0.8}
    >
      <View style={[styles.gradientOverlay, { backgroundColor: gradient[0] }]} />
      <View style={styles.statCardContent}>
        <View style={styles.statCardHeader}>
          <View style={styles.statCardInfo}>
            <Text style={styles.statCardTitle}>{title}</Text>
            <Text style={styles.statCardValue}>{value}</Text>
          </View>
          <View style={[styles.statCardIcon, { backgroundColor: gradient[1] }]}>
            <Ionicons name={icon as any} size={28} color={COLORS.TEXT} />
          </View>
        </View>
        {expandable && (
          <View style={styles.expandToggle}>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.ITEM_TEXT}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.SUCCESS} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={ // Add RefreshControl to ScrollView
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.SUCCESS]} // Color of the refresh indicator
            tintColor={COLORS.SUCCESS} // iOS tint color
            title="Đang làm mới..." // iOS loading text
            titleColor={COLORS.ITEM_TEXT} // iOS text color
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerGradient} />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Dashboard Analytics</Text>
            <Text style={styles.headerSubtitle}>
              Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            title="Đơn hàng hoàn thành"
            value={stats.totalOrders}
            icon="receipt-outline"
            gradient={[COLORS.PRIMARY, COLORS.ITEM_ACTIVE_BLUE]}
          />
         
          <StatCard
            title="Doanh thu tháng này"
            value={formatCurrency(stats.monthlyRevenue)}
            icon="trending-up-outline"
            gradient={[COLORS.WARNING, COLORS.ERROR]}
          />
         
          <StatCard
            title="Tổng sản phẩm"
            value={`${stats.totalProducts + stats.totalToppings} items`}
            icon="cube-outline"
            gradient={[COLORS.INFO, COLORS.BLUE_LIGHT]}
            expandable
            expanded={expandedProducts}
            onPress={() => setExpandedProducts(!expandedProducts)}
          />

          {expandedProducts && (
            <View style={styles.expandedContent}>
              <View style={styles.expandedItem}>
                <View style={styles.expandedIcon}>
                  <Ionicons name="cafe-outline" size={20} color={COLORS.SUCCESS} />
                </View>
                <Text style={styles.expandedLabel}>Đồ uống</Text>
                <Text style={styles.expandedValue}>{stats.totalProducts}</Text>
              </View>
              <View style={[styles.expandedItem, { borderBottomWidth: 0 }]}>
                <View style={styles.expandedIcon}>
                  <Ionicons name="add-circle-outline" size={20} color={COLORS.ERROR} />
                </View>
                <Text style={styles.expandedLabel}>Topping</Text>
                <Text style={styles.expandedValue}>{stats.totalToppings}</Text>
              </View>
            </View>
          )}
         
          <StatCard
            title="Người dùng hoạt động"
            value={stats.totalUsers}
            icon="people-outline"
            gradient={[COLORS.SUCCESS, COLORS.SUCCESS]}
          />
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <Text style={styles.chartTitle}>Biểu đồ doanh thu</Text>
              <Text style={styles.chartSubtitle}>Đơn vị: Nghìn VNĐ</Text>
            </View>
          </View>
         
          <View style={styles.chartToggleContainer}>
            <View style={styles.chartToggle}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  chartPeriod === 'week' && styles.toggleButtonActive,
                ]}
                onPress={() => setChartPeriod('week')}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    chartPeriod === 'week' && styles.toggleButtonTextActive,
                  ]}
                >
                  7 ngày
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  chartPeriod === 'month' && styles.toggleButtonActive,
                ]}
                onPress={() => setChartPeriod('month')}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    chartPeriod === 'month' && styles.toggleButtonTextActive,
                  ]}
                >
                  12 tháng
                </Text>
              </TouchableOpacity>
            </View>
          </View>
         
          {revenueChartData.labels.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chartScrollView}
              contentContainerStyle={styles.chartScrollContent}
            >
              <LineChart
                data={revenueChartData}
                width={Math.max(screenWidth - 40, revenueChartData.labels.length * 80)}
                height={240}
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: COLORS.ITEM_BACKGROUND,
                  backgroundGradientTo: COLORS.ITEM_BACKGROUND,
                  decimalPlaces: 1,
                  color: (opacity = 1) => COLORS.SUCCESS,
                  labelColor: (opacity = 1) => `${COLORS.TEXT}80`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '3',
                    stroke: COLORS.SUCCESS,
                    fill: COLORS.ITEM_BACKGROUND,
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: COLORS.ITEM_BORDER,
                    strokeWidth: 1,
                  },
                  fillShadowGradient: COLORS.SUCCESS,
                  fillShadowGradientOpacity: 0.3,
                }}
                bezier
                style={styles.chart}
                withShadow={true}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={true}
                withHorizontalLines={true}
              />
            </ScrollView>
          )}
        </View>

        <View style={styles.topProductsContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy-outline" size={24} color={COLORS.WARNING} />
            <Text style={styles.sectionTitle}>Top 5 Sản Phẩm Bán Chạy</Text>
          </View>
         
          {topProducts.length > 0 ? (
            topProducts.map((product, index) => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.topProductItem}
                onPress={() => handleProductPress(product.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.topProductRank,
                  {
                    backgroundColor:
                      index === 0
                        ? COLORS.WARNING
                        : index === 1
                        ? COLORS.BORDER_MEDIUM
                        : index === 2
                        ? COLORS.WARNING_BACKGROUND
                        : COLORS.SUCCESS,
                  }
                ]}>
                  <Text style={styles.topProductRankText}>{index + 1}</Text>
                </View>
                <View style={styles.topProductInfo}>
                  <Text style={styles.topProductName}>{product.name}</Text>
                  <View style={styles.quantityContainer}>
                    <Ionicons name="trending-up" size={16} color={COLORS.SUCCESS} />
                    <Text style={styles.topProductQuantity}>
                      {product.quantity} đã bán
                    </Text>
                  </View>
                </View>
                <View style={styles.productProgress}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${(product.quantity / Math.max(...topProducts.map(p => p.quantity), 1)) * 100}%` }
                    ]}
                  />
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.ITEM_TEXT} style={styles.chevronIcon} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color={COLORS.ITEM_TEXT} />
              <Text style={styles.emptyStateText}>Chưa có dữ liệu sản phẩm bán chạy</Text>
            </View>
          )}
        </View>

        <View style={styles.topCustomersContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-circle-outline" size={24} color={COLORS.ERROR} />
            <Text style={styles.sectionTitle}>Top 5 Khách Hàng Thân Thiết</Text>
          </View>
         
          {topCustomers.length > 0 ? (
            topCustomers.map((customer, index) => (
              <TouchableOpacity 
                key={customer.id} 
                style={styles.topCustomerItem}
                onPress={() => handleCustomerPress(customer.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.topCustomerRank,
                  {
                    backgroundColor:
                      index === 0
                        ? COLORS.WARNING
                        : index === 1
                        ? COLORS.BORDER_MEDIUM
                        : index === 2
                        ? COLORS.WARNING_BACKGROUND
                        : COLORS.ERROR,
                  }
                ]}>
                  <Text style={styles.topCustomerRankText}>{index + 1}</Text>
                </View>
                <View style={styles.topCustomerInfo}>
                  <Text style={styles.topCustomerName}>{customer.name}</Text>
                  <Text style={styles.topCustomerEmail}>{customer.email}</Text>
                  <View style={styles.customerStatsContainer}>
                    <View style={styles.customerStat}>
                      <Ionicons name="receipt" size={14} color={COLORS.SUCCESS} />
                      <Text style={styles.customerStatText}>
                        {customer.orderCount} đơn hàng
                      </Text>
                    </View>
                    <View style={styles.customerStat}>
                      <Ionicons name="card" size={14} color={COLORS.INFO} />
                      <Text style={styles.customerStatText}>
                        {formatCurrency(customer.totalSpent)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.customerProgress}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${(customer.orderCount / Math.max(...topCustomers.map(c => c.orderCount), 1)) * 100}%` }
                    ]}
                  />
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.ITEM_TEXT} style={styles.chevronIcon} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={COLORS.ITEM_TEXT} />
              <Text style={styles.emptyStateText}>Chưa có dữ liệu khách hàng thân thiết</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
    fontWeight: '500',
  },
  statsContainer: {
    padding: 20,
    paddingTop: 30,
  },
  statCard: {
    height: 120,
    borderRadius: 20,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: COLORS.ITEM_BACKGROUND,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  statCardContent: {
    flex: 1,
    padding: 20,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statCardInfo: {
    flex: 1,
  },
  statCardTitle: {
    fontSize: 16,
    color: COLORS.ITEM_TEXT,
    fontWeight: '500',
    marginBottom: 8,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  statCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandToggle: {
    alignItems: 'center',
    paddingTop: 10,
  },
  expandedContent: {
    backgroundColor: COLORS.CONTENT_ACCORDION,
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
    marginHorizontal: 20,
  },
  expandedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ITEM_BORDER,
  },
  expandedIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.ITEM_BACKGROUND,
  },
  expandedLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    marginLeft: 10,
  },
  expandedValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  chartContainer: {
    padding: 20,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 20,
    margin: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitleContainer: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  chartSubtitle: {
    fontSize: 12,
    color: COLORS.ITEM_TEXT,
    fontWeight: '500',
  },
  chartToggleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.CONTENT_ACCORDION,
    borderRadius: 10,
    padding: 5,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.SUCCESS,
  },
  toggleButtonText: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: COLORS.ITEM_BACKGROUND,
  },
  chartScrollView: {
    flexGrow: 0,
  },
  chartScrollContent: {
    paddingBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  topProductsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginLeft: 10,
  },
  topProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  topProductRank: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topProductRankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.ITEM_BACKGROUND,
  },
  topProductInfo: {
    flex: 1,
    marginLeft: 15,
  },
  topProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topProductQuantity: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    marginLeft: 5,
  },
  productProgress: {
    width: 80,
    height: 6,
    backgroundColor: COLORS.CONTENT_ACCORDION,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 3,
  },
  topCustomersContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  topCustomerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  topCustomerRank: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topCustomerRankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.ITEM_BACKGROUND,
  },
  topCustomerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  topCustomerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 5,
  },
  topCustomerEmail: {
    fontSize: 12,
    color: COLORS.ITEM_TEXT,
    marginBottom: 8,
  },
  customerStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  customerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  customerStatText: {
    fontSize: 12,
    color: COLORS.ITEM_TEXT,
    marginLeft: 5,
  },
  customerProgress: {
    width: 80,
    height: 6,
    backgroundColor: COLORS.CONTENT_ACCORDION,
    borderRadius: 3,
    overflow: 'hidden',
  },
  chevronIcon: {
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.ITEM_BACKGROUND,
    borderRadius: 12,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.ITEM_TEXT,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Dashboard;