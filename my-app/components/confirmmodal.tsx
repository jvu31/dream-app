import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles, { colors } from 'styles';

interface Props {
  visible: boolean;
  text: string;
  onClose(): void;
  onConfirm(): void;
}

export default function ConfirmModal({ visible, text, onClose, onConfirm }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 280,
            backgroundColor: colors.secondary,
            borderRadius: 20,
            paddingVertical: 30,
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <Text style={[styles.h2, { textAlign: 'center', marginBottom: 20 }]}>{text}</Text>

          <View style={{ flexDirection: 'row', gap: 15 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}>
              <Text style={[styles.h2, { color: colors.accent }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: colors.accent,
              }}>
              <Text style={[styles.h2, { color: '#fff' }]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
