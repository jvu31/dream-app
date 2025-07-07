import { View, Text, TouchableOpacity } from 'react-native';
import { styles, colors } from 'styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Tag from '../components/tag';

interface Props {
  entry_id: number;
  icon: string;
  time: string;
  content: string;
  recording_id: number;
}

export default function EntryView({ entry_id, icon, time, content, recording_id }: Props) {
  const test = () => {};
  const date = new Date(time);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = daysOfWeek[date.getDay()];

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
          <Text style={[styles.h2, { opacity: 0.5 }]}>{day}</Text>
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
            <Text
              style={
                styles.h2
              }>{`${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`}</Text>
            <Text style={[styles.h4, { opacity: 0.5 }]} numberOfLines={1} ellipsizeMode="tail">
              {'00:48s'}
            </Text>
          </View>

          <Text style={[styles.h4, { opacity: 0.5 }]} numberOfLines={2} ellipsizeMode="tail">
            {content}
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
