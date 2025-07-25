import React, { useEffect, useRef } from 'react';
import { Animated, View, TouchableOpacity, Text } from 'react-native';
import { colors, styles } from 'styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Option {
  name: string;
  icon: string;
  action: () => void;
}

interface Props {
  options: Option[];
}

const Dropdown = React.memo(function Dropdown({ options }: Props) {
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 125,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        backgroundColor: colors.accent,
        width: '45%',
        position: 'absolute',
        top: '6%',
        left: '50%',
        borderRadius: 10,
        paddingVertical: 8,
        transform: [{ translateY }],
        opacity,
      }}
    >
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.name}
          onPress={option.action}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={[styles.h5, { color: colors.text }]}>{option.name}</Text>
            <FontAwesome
              name={option.icon as any}
              size={20}
              color={colors.text}
              style={{ opacity: 0.5, marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
});

export default Dropdown;
