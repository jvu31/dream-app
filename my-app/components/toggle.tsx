import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles, colors } from 'styles';

interface Props {
  option1: string;
  option2: string;
  returnValue: (value: string) => void;
}

export default function Toggle({ option1, option2, returnValue }: Props) {
  const [selectedOption, setSelectedOption] = useState(option1);

  const updateValue = (value: string) => {
    setSelectedOption(value);
    returnValue(value);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateValue(option1)}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={[
            styles.h2,
            {
              color: colors.text,
              opacity: selectedOption === option1 ? 1 : 0.5,
            },
          ]}>
          {option1.charAt(0).toUpperCase() + option1.slice(1)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateValue(option2)}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={[
            styles.h2,
            {
              color: colors.text,
              opacity: selectedOption === option2 ? 1 : 0.5,
            },
          ]}>
          {option2.charAt(0).toUpperCase() + option2.slice(1)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
