import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles, colors } from 'styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Tag from './tag';
import { fetchEntryTags, fetchRecording } from 'db/queries';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'expo-router';
import { convertSecondsToMinutesAndSeconds, groupTags, parseDay, parseTime } from './utils';

interface Props {
  entry_id: number;
  icon: string;
  time: string;
  title: string;
  content: string;
  recording_id: number;
}

const EntryView = React.memo(function EntryView({
  entry_id,
  icon,
  title,
  time,
  content,
  recording_id,
}: Props) {
  const test = () => {};
  const [tags, setTags] = useState([]);
  const [moods, setMoods] = useState([]);
  const [people, setPeople] = useState([]);
  const [audio, setAudio] = useState([]);
  const [currentTitle, setCurrentTitle] = useState<string>();

  // Fetches the tags tied to an entry
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await fetchEntryTags(entry_id);
        setTags(data);
        //console.log('Tags fetched!');
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();

    if (title === '') {
      setCurrentTitle(parseTime(time));
    } else {
      setCurrentTitle(title);
    }
  }, []);

  // Saves the mood and people tags from the fetched tags
  useEffect(() => {
    if (tags.length === 0) return;

    const grouped = groupTags(tags);

    setMoods(grouped['mood'] || []);
    setPeople(grouped['people'] || []);

    //console.log('Tags grouped!');
  }, [tags]);

  // Fetches the entry's audio recording
  useEffect(() => {
    if (!recording_id) {
      setAudio(null); // clear old audio if recording_id was removed
      return;
    }

    const fetchAudio = async () => {
      try {
        const data: any = await fetchRecording(recording_id);
        setAudio(data);
      } catch (error) {
        //console.error('Error fetching audio recording:', error);
        setAudio(null); // fallback for invalid/missing recording
      }
    };

    fetchAudio();
  }, [recording_id]);

  return (
    <Link href={`entry/${entry_id}`} asChild>
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
            alignItems: 'center',
          }}>
          {/* Icon & day */}
          <View style={{ alignItems: 'center', flexShrink: 0 }}>
            <FontAwesome name="smile-o" size={60} color="white" style={{ opacity: 0.5 }} />
            <Text style={[styles.h2, { opacity: 0.5 }]}>{parseDay(time)}</Text>
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
              <Text style={styles.h2}>{currentTitle}</Text>
              {audio !== null ? (
                <Text style={[styles.h4, { opacity: 0.5 }]} numberOfLines={1} ellipsizeMode="tail">
                  {convertSecondsToMinutesAndSeconds(audio.length)}
                </Text>
              ) : (
                <Text style={[styles.h4, { opacity: 0.5 }]}><></></Text>
              )}
            </View>

            <Text style={[styles.h4, { opacity: 0.5 }]} numberOfLines={2} ellipsizeMode="tail">
              {content}
            </Text>

            <View style={{ marginTop: 8 }}>
              <FlatList
                data={moods}
                renderItem={({ item }) => (
                  <Tag
                    tag_id={item.tag_id}
                    tag={item.name}
                    color1={item.color}
                    type="mood"
                    active={true}
                    onPress={test}
                  />
                )}
                keyExtractor={(item) => item.tag_id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 8,
                }}
              />
              <FlatList
                data={people}
                renderItem={({ item }) => (
                  <Tag
                    tag_id={item.tag_id}
                    tag={item.name}
                    color1={item.color}
                    type="people"
                    active={true}
                    onPress={test}
                  />
                )}
                keyExtractor={(item) => item.tag_id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 8,
                }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
});

export default EntryView;
