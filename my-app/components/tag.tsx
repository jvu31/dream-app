import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import styles, { colors } from 'styles';

interface Props {
  tag: string;
  color1: string;
  active: boolean;
  type: string;
  onPress: () => void;
}

const Tag = React.memo(function Tag({ tag, color1, active, type, onPress }: Props) {
  const animationValue = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: active ? 1 : 0,
      duration: 100,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true, // Opacity is supported by the native driver for performance
    }).start();
  }, [active]);

  // Darkens a hex value by a certain factor
  function darkenHexColor(hex, factor) {
    return (
      '#' +
      [1, 3, 5]
        .map((i) => {
          const channel = parseInt(hex.substr(i, 2), 16);
          const darker = Math.round(channel * (1 - factor));
          return darker.toString().padStart(2, '0');
        })
        .join('')
    );
  }

  // Tag for people (differs with no background)
  if (type === 'people') {
    const textOpacity = animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });
    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, padding: 3 }}>
          <Animated.Text style={[styles.h4, { opacity: textOpacity, color: colors.text }]}>
            {tag}
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  }

  // These styles are applied to both active and inactive wrapper views to ensure they are the same size.
  const wrapperStyle = {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 6,
  };

  // Tag for moods (with pill background)
  const activeOpacity = animationValue;
  const inactiveOpacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <TouchableOpacity onPress={onPress} style={{ borderRadius: 10 }}>
      <View>
        {/* Active view */}
        <Animated.View style={{ opacity: activeOpacity }}>
          <LinearGradient
            colors={[color1, darkenHexColor(color1, 0.7)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={wrapperStyle}>
            <Text style={styles.h4}>{tag}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Inactive view, positioned absolutely to cross-fade */}
        <Animated.View
          style={[
            wrapperStyle,
            { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: inactiveOpacity },
          ]}>
          <Text style={[styles.h4, { opacity: 0.5, color: colors.text }]}>{tag}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
});

export default Tag;
