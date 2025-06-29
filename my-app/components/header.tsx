import { View, Image, Button } from 'react-native';

export default function Header() {
  const test = () => {};
  return (
    <View >
      <Image
        source={require('../assets/icon.png')}
        style={{ width: 40, height: 40, borderRadius: 10 }}
      />
      <View >
        <Button title="test" onPress={test} />
      </View>
    </View>
  );
}
