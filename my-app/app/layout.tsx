import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: "flip"
        }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="entry/[id]"
          options={{
            gestureEnabled: true,
          }}
        />
      </Stack>
    </>
  );
}
