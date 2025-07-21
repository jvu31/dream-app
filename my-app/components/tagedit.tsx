import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { styles, colors } from 'styles';
import React, { useState } from 'react';
import ColorPicker, {
  HueCircular,
  HueSlider,
  OpacitySlider,
  Panel1,
  Panel2,
  Panel3,
  Preview,
  Swatches,
} from 'reanimated-color-picker';

interface Props {
  tag_id: number;
  name: string;
  color: string;
  onClose: () => void;
}

const TagEdit = React.memo(function TagEdit({ tag_id, name, color, onClose }: Props) {
  const [currentColor, setCurrentColor] = useState(color);
  const handleComplete = ({ hex }) => {
    setCurrentColor(hex);
    console.log('Selected color:', hex);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true} // The parent component controls visibility by mounting/unmounting
      onRequestClose={onClose}>
      <TouchableOpacity
        style={localStyles.overlay}
        activeOpacity={1}
        onPress={onClose} // Closes the modal when the backdrop is pressed
      >
        <View style={localStyles.modalView}>
          <Text style={styles.h2}>Editing: {name}</Text>
          <ColorPicker value={currentColor} onComplete={() => handleComplete}>
            <Preview />
            <Panel1 />
            <HueSlider />
            <OpacitySlider />
            <Swatches />
          </ColorPicker>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Text style={[styles.h3, { color: colors.accent }]}>Close</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darkened background
  },
  modalView: {
    width: '80%',
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default TagEdit;
