import { View, Text, TouchableOpacity } from 'react-native';
import { styles, colors } from 'styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Tag from '../components/tag';

interface Props {
  id: number;
  icon: string;
  day: string;
  time: string;
  length: number;
  content: string;
  tags: string[];
  people: string[];
}

export default function EntryView() {
  const test = () => {};

  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.secondary,
        padding: 16,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
      }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          flexWrap: 'nowrap',
          alignItems: 'flex-start',
        }}>
        {/* Icon & day */}
        <View style={{ alignItems: 'center', flexShrink: 0 }}>
          <FontAwesome name="smile-o" size={60} color="white" style={{ opacity: 0.5 }} />
          <Text style={[styles.h2, { opacity: 0.5 }]}>Wed</Text>
        </View>

        {/* Content */}
        <View style={{ flex: 1, flexShrink: 1, minWidth: 0 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            <Text style={styles.h2}>9:30 AM</Text>
            <Text style={[styles.h4, { opacity: 0.5 }]} numberOfLines={1} ellipsizeMode="tail">
              {'00:48s'}
            </Text>
          </View>

          <Text style={[styles.h4, { opacity: 0.5 }]} numberOfLines={2} ellipsizeMode="tail">
            This is the main body of a journal entry, and with this body it is supposed to provide
            an initial snippet into the content. It will wrap naturally if it’s longer!
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 8,
              gap: 8,
            }}>
            <Tag tag={'Happy'} color1={'#0dff00'} color2={'#078500'} active={true} onPress={test} />
            <Tag
              tag={'Grateful'}
              color1={'#ff9900'}
              color2={'#cc6600'}
              active={true}
              onPress={test}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
