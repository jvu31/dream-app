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
        backgroundColor: colors.secondary,
        paddingHorizontal: 10,
        borderRadius: 10,
      }}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="search" size={16} color={colors.text} style={{ opacity: 0.5 }} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={colors.text}
            onChangeText={setSearchValue}
            style={[styles.h2, { flex: 1, opacity: 0.5 }]}
          />
        </View>
        <TouchableOpacity onPress={openFilters}>
          <FontAwesome name="filter" size={18} color={colors.text} style={{ opacity: 0.5 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
