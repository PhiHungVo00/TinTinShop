import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { callFetchAccount } from '@/config/api';
import { useAppContext } from '@/context/AppContext';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

const RootPage = () => {
  const { setUser } = useAppContext();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const res = await callFetchAccount();
        if (res.data) {
          setUser(res.data);
          if (res.data.user.role?.name.toLowerCase() === 'admin') {
            router.replace('../(admin)/home');
          } else {
            router.replace('../(user)/home');
          }
        } else {
          router.replace('../(auth)/WelcomeScreen');
        }

        
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) return null;

  return <View style={{ flex: 1 }} />;
};

export default RootPage;
