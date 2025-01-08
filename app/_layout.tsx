import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="track/[id]"
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerTintColor: '#fff',
       }}
       />
      <Stack.Screen
        name="artist/[id]"
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerTintColor: '#fff',
       }}
       />
    </Stack>
  );
}
