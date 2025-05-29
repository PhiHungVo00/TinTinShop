interface Store {
    name: string;
    latitude: number;
    longitude: number;
    description: string;
    image: any;
}

export const mockStores: Store[] = [
    { 
        name: "Chi nhánh 1", 
        latitude:10.876495236884416, 
        longitude: 106.80974127699555, 
        description: "65 Tân Lập, Đông Hoà, Thủ Đức, Hồ Chí Minh, Vietnam",
        image: require("@/assets/images/store/chi-nhanh1.jpg"),
     },
       
    { 
        name: "Chi nhánh 2", 
        latitude: 10.775234949081192, 
        longitude: 106.69985689290397, 
        description: "86 Đ. Lê Thánh Tôn, Bến Nghé, Quận 1, Hồ Chí Minh, Vietnam",
        image: require("@/assets/images/store/chi-nhanh2.jpg"),
     },
       
    { name: "Chi nhánh 3", 
        latitude:   10.806351711578312, 
        longitude: 106.71474044602637, 
        description: "60-84 Đường D5, Phường 25, Bình Thạnh, Hồ Chí Minh, Vietnam",
        image: require("@/assets/images/store/chi-nhanh3.jpg"),
     },

        
  ];