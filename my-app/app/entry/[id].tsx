import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles, { colors } from 'styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  addEntry,
  addMultipleTagsToEntry,
  addTagToEntry,
  editEntry,
  fetchEntry,
  fetchEntryTags,
  fetchRecording,
  removeEntry,
  removeRecording,
  removeTagFromEntry,
} from 'db/queries';
import { EntryModel, RecordingModel } from 'db/interfaces';
import {
  convertSecondsToMinutesAndSeconds,
  groupTags,
  parseMonth,
  parseTime,
} from 'components/utils';
import Tag from 'components/tag';
import FilterSheet from 'components/filtersheet';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import Dropdown from 'components/dropdown';
import ConfirmModal from 'components/confirmmodal';

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
  const [currentPin, setCurrentPin] = useState<boolean>();
  const [modal, setModal] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  // Data for handling the option dropdown menu
  const [openOptions, setOptions] = useState(false);

  // Fetch the journal entry data
  useEffect(() => {
    // New Entry
    if (Number(id) === -1) {
      const data = {
        entry_id: -1,
        pinned: 0,
        time: new Date().toISOString(),
        content: '',
        title: '',
        recording_id: null,
      };
      setEntry(data);
      // Preexisting entry
    } else {
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
    }
  }, [id, currentPin]);

  // Sets corresponding entry data
  useEffect(() => {
    if (!entry) return;

    // Fetches recording data (there can be a no recording data)
    if (entry.recording_id) {
      const fetchRecordingData = async () => {
        try {
          const data = await fetchRecording(entry.recording_id);
          setRecording(data);
        } catch (error) {
          //console.error('Error fetching recording:', error);
        }
      };

      fetchRecordingData();
    } else {
      setRecording(null); // Explicitly clear old recording if switching to a no-recording entry
    }

    // Fetches the tags tied to an entry
    const fetchTags = async () => {
      try {
        const data = await fetchEntryTags(Number(id));
        setTags(data);
        console.log('Tags fetched!');
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
  }, [tags]);

  // Handle user changes to content and entry values
  const handleChange = async (type: string, value: any) => {
    switch (type) {
      case 'title':
        setCurrentTitle(value);
        //await editEntry(Number(id), value, 'title');
        break;
      case 'content':
        setCurrentContent(value);
        //await editEntry(Number(id), value, 'content');
        break;
      case 'pinned':
        setCurrentPin(value);
        //await editEntry(Number(id), value, 'pinned');
        break;
    }

    await editEntry(Number(id), value, type);
  };

  // Opens the filters
  const openFilters = () => {
    bottomSheetRef.current?.expand();
  };

  // Renders a backdrop that closes the sheet on press
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  // Handle change to entry's tags
  const changeTags = async (tag_id: number) => {
    // Tag already included, meaning user wants to remove
    if (tags.some((tag) => tag.tag_id === tag_id)) {
      await removeTagFromEntry(Number(id), tag_id);

      // Tag not already in entry's tags, meaning user wants to add
    } else {
      await addTagToEntry(Number(id), tag_id);
    }

    const data = await fetchEntryTags(Number(id));
    setTags(data);
  };

  // Handle returning to previous page
  const handleBack = async () => {
    if (Number(id) === -1) {
      console.log('Creating a new entry!');
      const newEntryArray = await addEntry({
        pinned: entry.pinned,
        time: entry.time,
        content: currentContent,
        title: currentTitle,
      });
      const newEntry = Array.isArray(newEntryArray) ? newEntryArray[0] : newEntryArray;

      await addMultipleTagsToEntry(
        newEntry.entry_id,
        tags.map((t) => t.tag_id)
      );
    }

    router.back();
  };

  // Handling the option menu actions
  const deleteEntry = async () => {
    await removeEntry(Number(id));
    setModal(false);
    router.back();
  };
  const pinEntry = () => {
    handleChange('pinned', !currentPin);
    setOptions(false);
  };
  const removeAudio = async () => {
    await removeRecording(entry.recording_id);
    setRecording(null);
    setEntry({ ...entry, recording_id: null });
    setOptions(false);
  };

  const options = [
    { name: 'Delete Entry', icon: 'trash', action: () => setModal(true) },
    { name: 'Pin Entry', icon: 'archive', action: pinEntry },
    { name: 'Remove Audio', icon: 'play', action: removeAudio },
  ];

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
          <TouchableOpacity onPress={handleBack}>
            <Text style={[styles.h2, { color: colors.accent }]}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOptions(!openOptions)}>
            <FontAwesome
              name="align-justify"
              size={24}
              color={colors.accent}
              style={{ opacity: 0.5, marginRight: 8 }}
            />
          </TouchableOpacity>
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
              {recording ? (
                <>
                  <Text style={[styles.h2, { opacity: 0.5 }]}>
                    {convertSecondsToMinutesAndSeconds(recording.length)}
                  </Text>
                  <TouchableOpacity>
                    <FontAwesome name="play-circle" size={20} color={colors.text} />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity>
                  <Text style={[styles.h2, { opacity: 0.5, textDecorationLine: 'underline' }]}>
                    Add a recording...
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Content of the journal entry */}
            <View style={{ height: '65%' }}>
              <TextInput
                style={[styles.h2, { opacity: 0.65, textAlignVertical: 'top' }]}
                value={currentContent}
                multiline={true}
                placeholder="What is on your mind?"
                placeholderTextColor={colors.text}
                onChange={(e) => handleChange('content', e.nativeEvent.text)}
              />
            </View>
            {/* Tag information */}
            <View style={{ gap: 8 }}>
              {[
                { title: 'Moods', data: moods, type: 'mood' },
                { title: 'People', data: people, type: 'people' },
              ].map((group) => (
                <View key={group.title} style={{ gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.h2, { opacity: 0.5 }]}>{group.title}</Text>
                    <TouchableOpacity onPress={openFilters}>
                      <FontAwesome
                        name="edit"
                        size={18}
                        color={colors.text}
                        style={{ opacity: 0.5 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={group.data}
                    renderItem={({ item }) => (
                      <Tag
                        tag_id={item.tag_id}
                        tag={item.name}
                        color1={item.color}
                        type={group.type}
                        active={true}
                        onPress={test}
                      />
                    )}
                    keyExtractor={(item) => item.tag_id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                  />
                </View>
              ))}
            </View>
            {/* Bottom timestamp */}
            <View>
              <Text style={[styles.h5, { textAlign: 'center', opacity: 0.5 }]}>
                Created {parseMonth(entry?.time)} at {parseTime(entry?.time)}
              </Text>
            </View>
          </View>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          backgroundStyle={{
            backgroundColor: colors.secondary,
          }}
          handleIndicatorStyle={{
            backgroundColor: 'rgba(255, 255, 255, 1)',
          }}>
          <BottomSheetView>
            <FilterSheet
              tagFilters={tags.map((t) => t.tag_id)}
              setTagFilters={changeTags}
              setDateRange={test}
            />
          </BottomSheetView>
        </BottomSheet>
        {openOptions && <Dropdown options={options} />}
        <ConfirmModal
          visible={modal}
          text={'Are you sure you want to delete this entry?'}
          onClose={() => setModal(false)}
          onConfirm={deleteEntry}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
