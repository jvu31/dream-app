import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from 'react-native';
import { styles, colors } from 'styles';
import React, { useState } from 'react';
import ColorPicker, { type ColorFormatsObject, HueSlider, Panel1 } from 'reanimated-color-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { darkenHexColor } from './utils';
import { editTag } from 'db/queries';

interface Props {
  tag_id: number;
  name: string;
  color: string;
  onClose: () => void;
}

const TagEdit = React.memo(function TagEdit({ tag_id, name, color, onClose }: Props) {
  const [currentColor, setCurrentColor] = useState(color);
  const [currentName, setName] = useState(name);

  const onColorChange = (color: ColorFormatsObject) => {
    setCurrentColor(color.hex);
  };

  const saveChanges = async () => {
    await editTag(tag_id, currentName, 'name');
    await editTag(tag_id, currentColor, 'color')
    onClose()
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true} // The parent component controls visibility by mounting/unmounting
      onRequestClose={onClose}>
      <TouchableOpacity style={localStyles.overlay} activeOpacity={1}>
        <View style={localStyles.modalView}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              style={[styles.h3, { textDecorationLine: 'underline' }]}
              value={currentName}
              onChange={(e) => setName(e.nativeEvent.text)}></TextInput>
            <LinearGradient
              colors={[currentColor, darkenHexColor(currentColor, 0.7)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                justifyContent: 'center',
                borderRadius: 10,
                paddingVertical: 3,
                paddingHorizontal: 6,
              }}>
              <Text style={styles.h4}>{currentName}</Text>
            </LinearGradient>
          </View>
          <ColorPicker
            value={currentColor}
            onChangeJS={onColorChange}
            style={{ height: 175, width: '100%', gap: 6 }}>
            <Panel1 style={{ borderRadius: 16, flex: 1 }} />
            <HueSlider />
          </ColorPicker>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
              <Text style={[styles.h2, { color: colors.accent }]}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveChanges} style={{ marginTop: 20 }}>
              <Text style={[styles.h2, { color: colors.accent }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
});

const localStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    width: '80%',
    backgroundColor: colors.secondary,
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 8,
  },
});

export default TagEdit;
