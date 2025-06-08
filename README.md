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

## 🛠️ Prerequisites

Before starting, ensure you have the following installed:

### Java Development Kit (JDK)
- **Required Version:** JDK 17 or JDK 21 (LTS versions recommended for Spring Boot)
- **Download:** [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)

### Verify Java Installation
After installing JDK, verify the installation:

```bash
java -version
javac -version
```

Expected output should show Java version 17+ or 21+:
```
java version "17.0.x" or "21.0.x"
Java(TM) SE Runtime Environment
Java HotSpot(TM) 64-Bit Server VM
```

### Configure JAVA_HOME Environment Variable

#### Windows:
1. Open System Properties → Advanced → Environment Variables
2. Add new System Variable:
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-17` (or your JDK installation path)
3. Add to PATH: `%JAVA_HOME%\bin`

#### macOS/Linux:
Add to your shell profile (`.bashrc`, `.zshrc`, etc.):
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk  # or your JDK path
export PATH=$JAVA_HOME/bin:$PATH
```

### Other Requirements
- **Node.js** (v16+) - for React Native
- **npm** or **yarn** - package manager
- **MySQL** (v8.0+) - database server
- **Git** - version control

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

**Important:** Make sure IntelliJ IDEA is configured to use the correct JDK:
1. Go to File → Project Structure → Project
2. Set Project SDK to JDK 17 or 21
3. Set Project language level to match your JDK version

---

## ⚙️ Setup

### Backend Configuration

#### 1.1 Verify Java Configuration

Before proceeding, ensure your development environment is properly configured:

```bash
# Check Java version (should be 17+ or 21+)
java -version

# Check JAVA_HOME is set
echo $JAVA_HOME  # Linux/macOS
echo %JAVA_HOME% # Windows
```

#### 1.2 Configure MySQL Database

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

#### 1.3 Configure Upload Folder URI

- Create a folder named `Upload` at the same level as the `client` and `server` folders.
- Place a dummy PDF file in it.
- Open the file in your browser and copy the full URI (excluding the filename).
- Use it to configure the file path in `application.properties`:

```properties
# Upload File Base URI
upload-file.base-uri=file:///D:/project/TinTin/upload/
```

#### 1.4 Backend Public Resource URL

- The public storage path will be available at:

```
http://localhost:8080/storage
```

### Frontend Configuration

#### Configure Backend IP

- Open a terminal on the backend machine.
- Run the command:

```bash
ipconfig    # Windows
ifconfig    # Linux/macOS
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
- Ensure the correct JDK is selected (File → Project Structure → Project SDK).
- Run the application using the Spring Boot main class.

If you encounter Java-related errors:
1. Check that JDK 17+ or 21+ is installed and configured
2. Verify JAVA_HOME environment variable
3. Ensure IntelliJ IDEA is using the correct JDK version

### Start Frontend

```bash
cd TinTinShop/client/TinTinMobile/
code .
npm start
```

- Press `a` to open the app in an Android emulator.
- Press `s` to start Expo and scan the QR code using **Expo Go** app on your phone.

---

## 🚨 Troubleshooting

### Common Java Issues

1. **"java: error: invalid target release"**
   - Solution: Ensure your JDK version matches the target version in your build configuration

2. **"JAVA_HOME not found"**
   - Solution: Set JAVA_HOME environment variable to your JDK installation directory

3. **"Unsupported Java version"**
   - Solution: Spring Boot requires JDK 17+ for recent versions. Upgrade your JDK if necessary

4. **IntelliJ IDEA compilation errors**
   - Solution: File → Invalidate Caches and Restart
   - Check Project Structure → Modules → Language Level

### Backend Connection Issues

- Verify MySQL service is running
- Check database credentials in `application.properties`
- Ensure the `tintinshop` schema exists

### Frontend Connection Issues

- Verify backend is running on the correct port
- Check `.env` file has the correct IPv4 address
- Ensure phone/emulator can reach the backend IP

---

## 📌 Notes

- **Java Version:** This project requires JDK 17 or newer. Using older versions may cause compilation errors.
- **Network Configuration:** If testing on smartphone (with Expo Go), ensure the **backend IP address** is accessible from your phone and correctly configured in `.env`.
- **Testing Tools:** Postman is recommended to test backend APIs.
- **Development Environment:** Android Studio is optional if you prefer to test using a simulator instead of a physical device.

---

## 👥 Contributors

- Trịnh Hòa – [GitHub](https://github.com/TrinhHoa-23520508)

---

Feel free to contribute or raise an issue if you encounter any problem during setup or usage!
