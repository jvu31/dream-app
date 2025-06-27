import { View, Image, Button } from 'react-native';

export default function Header() {
  const test = () => {};
  return (
    <View className="flex flex-row items-center justify-center py-4">
      <Image
        source={require('../assets/icon.png')}
        className="rounded-lg"
        style={{ width: 40, height: 40, borderRadius: 10 }}
      />
      <View className="absolute right-0">
        <Button title="test" onPress={test} />
      </View>
    </View>
  );
}
