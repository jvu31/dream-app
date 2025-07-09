import { View, TouchableOpacity, TextInput } from 'react-native';
import { colors, styles } from 'styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Props {
  setSearchValue: (value: string) => void;
  openFilters: () => void;
}

export default function SearchBar({ setSearchValue, openFilters }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderRadius: 10,
        overflow: 'hidden',  // clips corners
        paddingHorizontal: 12,
      }}
    >
      {/* Search icon and input */}
      <FontAwesome
        name="search"
        size={16}
        color={colors.text}
        style={{ opacity: 0.5, marginRight: 8 }}
      />
      <TextInput
        placeholder="Search"
        placeholderTextColor={colors.text}
        onChangeText={setSearchValue}
        style={[
          styles.h2,
          {
            flex: 1, // expands but respects the icon space
            opacity: 0.5,
          },
        ]}
      />

      {/* Filter icon with inner padding */}
      <TouchableOpacity
        onPress={openFilters}
        style={{
          paddingLeft: 8,  // ensures it doesn't hug the right edge
          paddingVertical: 4,
        }}
      >
        <FontAwesome
          name="filter"
          size={18}
          color={colors.text}
          style={{ opacity: 0.5 }}
        />
      </TouchableOpacity>
    </View>
  );
}
