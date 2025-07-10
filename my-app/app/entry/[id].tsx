import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles, { colors } from 'styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import { fetchEntry, fetchRecording } from 'db/queries';
import { EntryModel, RecordingModel } from 'db/interfaces';
import { convertSecondsToMinutesAndSeconds } from 'components/utils';

export default function Entry() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [entry, setEntry] = useState<EntryModel | null>();
  const [recording, setRecording] = useState<RecordingModel | null>();

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

  // Fetches recording data (only if there is recording data tied to entry)
  useEffect(() => {
    if (!entry) return;

    if (entry.recording_id) {
      const fetchRecordingData = async () => {
        try {
          const data = await fetchRecording(Number(id));
          setRecording(data);
          console.log('Recording fetched!');
        } catch (error) {
          console.error('Error fetching recording:', error);
        }
      };

      fetchRecordingData();
    }
  }, [entry]);

  // Handle user change in data change

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
            <Text style={[styles.h1, { marginTop: 24 }]}>{entry?.time ?? 'Loading...'}</Text>
            {/* Audio recording information */}
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Text style={[styles.h2, { opacity: 0.5 }]}>
                {convertSecondsToMinutesAndSeconds(recording?.length ?? 0)}
              </Text>
              <TouchableOpacity>
                <FontAwesome
                  name="play-circle"
                  size={20}
                  color={colors.text}
                  style={{ opacity: 0.5}}
                />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.h2} value={entry?.content ?? 'Loading...'} multiline={true}>
                
            </TextInput>
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
