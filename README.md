
# TinTinShop - Mobile Drink Ordering App

A mobile application project for the Mobile Programming course.

## 🚀 Technologies Used

**Frontend:**
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
- ![React Native](https://img.shields.io/badge/React%20Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)
- ![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)

**Backend:**
- ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=java&logoColor=white)
- ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)

**Database:**
- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)

**Development Tools:**
- ![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white)
- ![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ%20IDEA-000000?style=flat-square&logo=intellij-idea&logoColor=white)
- ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white)
- ![Android Studio](https://img.shields.io/badge/Android%20Studio-3DDC84?style=flat-square&logo=android-studio&logoColor=white)

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/TrinhHoa-23520508/TinTinShop.git
```

2. **Install Dependencies**

### 2.1 Frontend (React Native Mobile)

```bash
cd TinTinShop/client/TinTinMobile/
code .   # Open project in VSCode
npm install
```

### 2.2 Backend (Java Spring)

```bash
cd TinTinShop/server/TinTin/TinTin/
code .   # Open project in IntelliJ IDEA
```

---

## ⚙️ Setup

### Backend

#### 1.1 Configure MySQL Database

- Make sure MySQL is installed and running on port `3306`.
- Create a new schema with the name: `tintinshop`.
- Edit the `application.properties` file with your MySQL credentials:

```properties
# Database Configuration
spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=jdbc:mysql://localhost:3306/tintinshop
spring.datasource.username=root
spring.datasource.password=123456
```

#### 1.2 Configure Upload Folder URI

- Create a folder named `Upload` at the same level as the `client` and `server` folders.
- Place a dummy PDF file in it.
- Open the file in your browser and copy the full URI (excluding the filename).
- Use it to configure the file path in `application.properties`:

```properties
# Upload File Base URI
upload-file.base-uri=file:///D:/project/TinTin/upload/
```

#### 1.3 Backend Public Resource URL

- The public storage path will be available at:

```
http://localhost:8080/storage
```

### Frontend

#### Configure Backend IP

- Open a terminal on the backend machine.
- Run the command:

```bash
ipconfig
```

- Copy your **IPv4 address**.
- Open the `.env` file located in `TinTinShop/client/TinTinMobile/` and update the variables:

```env
EXPO_PUBLIC_IPV4=192.168.1.22
EXPO_PUBLIC_PORT=8080
EXPO_PUBLIC_PORT_STORAGE=storage
```

> **Note:** The IPv4 address may change based on your Wi-Fi/router setup. You will need to update the `.env` file if the address changes.

---

## ▶️ Usage

### Start Backend

- Open the backend project in **IntelliJ IDEA**.
- Run the application using the Spring Boot main class.

### Start Frontend

```bash
cd TinTinShop/client/TinTinMobile/
code .
npm start
```

- Press `a` to open the app in an Android emulator.
- Press `s` to start Expo and scan the QR code using **Expo Go** app on your phone.

---

## 📌 Notes

- If you are testing on your smartphone (with Expo Go), make sure the **backend IP address** is accessible from your phone and correctly configured in `.env`.
- Postman is recommended to test backend APIs.
- Android Studio is optional if you prefer to test using a simulator instead of a physical device.

---

## 👥 Contributors

- Trịnh Hòa – [GitHub](https://github.com/TrinhHoa-23520508)

---

Feel free to contribute or raise an issue if you encounter any problem during setup or usage!
