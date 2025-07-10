import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles, { colors } from 'styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, useEffect, useRef } from 'react';
import { editEntry, fetchEntry, fetchEntryTags, fetchRecording } from 'db/queries';
import { EntryModel, RecordingModel, TagModel } from 'db/interfaces';
import {
  convertSecondsToMinutesAndSeconds,
  groupTags,
  parseMonth,
  parseTime,
} from 'components/utils';
import Tag from 'components/tag';

export default function Entry() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [entry, setEntry] = useState<EntryModel | null>();
  const [recording, setRecording] = useState<RecordingModel | null>();
  const [tags, setTags] = useState([]);
  const [moods, setMoods] = useState([]);
  const [people, setPeople] = useState([]);
  const [currentTitle, setCurrentTitle] = useState<string>();
  const [currentContent, setCurrentContent] = useState<string>();

  // Fetch the journal entry data
  useEffect(() => {
    const fetchEntryData = async () => {
      try {
        const data = await fetchEntry(Number(id));
        setEntry(data);
        console.log('Entry fetched!');
      } catch (error) {
        console.error('Error fetching entry:', error);
      }
    };
    fetchEntryData();
  }, [id]);

  // Sets corresponding entry data
  useEffect(() => {
    if (!entry) return;

    // Fetches recording data (there can be a no recording data)
    if (entry.recording_id) {
      const fetchRecordingData = async () => {
        try {
          const data = await fetchRecording(entry.recording_id);
          setRecording(data);
          console.log('Recording fetched!');
        } catch (error) {
          console.error('Error fetching recording:', error);
        }
      };

      fetchRecordingData();
    }

    // Fetches the tags tied to an entry
    const fetchTags = async () => {
      try {
        const data = await fetchEntryTags(Number(id));
        setTags(data);
        //console.log('Tags fetched!');
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();

    // Sets entry content
    setCurrentContent(entry.content);

    // Sets entry title (defaults value to time value if there is no entry tittle)
    if (entry.title === '') {
      setCurrentTitle(parseTime(entry.time));
    } else {
      setCurrentTitle(entry.title);
    }
  }, [entry]);

  // Saves the mood and people tags from the fetched tags
  useEffect(() => {
    if (tags.length === 0) return;

    const grouped = groupTags(tags);

    setMoods(grouped['mood'] || []);
    setPeople(grouped['people'] || []);

    //console.log('Tags grouped!');
  }, [tags]);

  const handleChange = async (type: string, value: any) => {
    if (type === 'title') {
      setCurrentTitle(value);
      await editEntry(Number(id), value, 'title');
    } else if (type === 'content') {
      setCurrentContent(value);
      await editEntry(Number(id), value, 'content');
    }
  }

  const test = () => {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <GestureHandlerRootView>
        {/* Title Header */}
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            paddingHorizontal: 24,
            backgroundColor: colors.secondary,
            width: '100%',
          }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.h2, { color: colors.accent }]}>Back</Text>
          </TouchableOpacity>
          <FontAwesome
            name="search"
            size={24}
            color={colors.accent}
            style={{ opacity: 0.5, marginRight: 8 }}
          />
        </View>
        {/* Content */}
        <View style={[styles.container, { backgroundColor: 'rgba(43, 36, 53, 0.5)' }]}>
          <View style={{ gap: 8 }}>
            {/* Title of the journal entry (defaults to time if there is no title) */}
            <TextInput
              style={[styles.h1, { marginTop: 24 }]}
              value={currentTitle}
              onChange={(e) => handleChange('title', e.nativeEvent.text)}
            />
            {/* Audio recording information */}
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Text style={[styles.h2, { opacity: 0.5 }]}>
                {convertSecondsToMinutesAndSeconds(recording?.length ?? 0)}
              </Text>
              <TouchableOpacity>
                <FontAwesome name="play-circle" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            {/* Content of the journal entry */}
            <View style={{ height: '65%' }}>
              <TextInput
                style={[styles.h2, { opacity: 0.65 }]}
                value={currentContent}
                multiline={true}
                onChange={(e) => setCurrentContent(e.nativeEvent.text)}
              />
            </View>
            {/* Tag information */}
            <View style={{ gap: 8 }}>
              <View style={{ gap: 8 }}>
                <Text style={[styles.h2, { opacity: 0.5 }]}>Moods</Text>
                <FlatList
                  data={moods}
                  renderItem={({ item }) => (
                    <Tag
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
              </View>
              <View style={{ gap: 8 }}>
                <Text style={[styles.h2, { opacity: 0.5 }]}>People</Text>
                <FlatList
                  data={people}
                  renderItem={({ item }) => (
                    <Tag
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
            {/* Bottom timestamp */}
            <View>
              <Text style={[styles.h5, { textAlign: 'center', opacity: 0.5 }]}>
                Created {parseMonth(entry?.time)} at {parseTime(entry?.time)}
              </Text>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
