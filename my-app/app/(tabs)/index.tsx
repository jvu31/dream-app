import { Text, View, SafeAreaView, SectionList } from 'react-native';
import { colors, styles } from '../../styles';
import Header from '../../components/header';
import EntryView from 'components/entryview';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { fetchAllEntriesTest } from 'db/queries';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../../components/searchbar';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [groupedEntries, setGroupedEntries] = useState([]);
  const [moodFilters, setMoodFilters] = useState([]);
  const [peopleFilters, setPeopleFilters] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  // Fetches the ids from the database
  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchEntries = async () => {
        try {
          const data = await fetchAllEntriesTest();
          setEntries(data);
          console.log('Fetched entries!');
        } catch (error) {
          console.error('Error fetching entries:', error);
        }
      };

      fetchEntries();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, []);

  // Groups the entries based on month
  useEffect(() => {
    if (entries.length === 0) return;

    // Group by month
    const grouped = entries.reduce((acc, entry) => {
      const date = new Date(entry.time);
      const monthYear = date.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(entry);
      return acc;
    }, {});

    // Convert to SectionList format
    const sections = Object.keys(grouped).map((month) => ({
      title: month,
      data: grouped[month],
    }));

    setGroupedEntries(sections);
    console.log('Grouped entries by month!');
  }, [entries]);

  // Set search value with debounce call to database

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

  // Opens the filters
  const openFilters = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <GestureHandlerRootView
        style={[styles.container, { backgroundColor: 'rgba(43, 36, 53, 0.5)' }]}>
        <Header />
        {/* Search bar */}
        <SearchBar setSearchValue={setSearchValue} openFilters={openFilters} />
        {/* List of entries */}
        <SectionList
          sections={groupedEntries}
          keyExtractor={(item, index) => `${item.entry_id}-${index}`}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 8, gap: 4 }}>
              <Text style={[styles.h2, { opacity: 0.5 }]}>
                {new Date(item.time).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
              <EntryView
                entry_id={item.entry_id}
                icon={item.icon}
                time={item.time}
                content={item.content}
                recording_id={item.recording_id}
              />
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => <Text style={styles.h1}>{title}</Text>}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={3}
          removeClippedSubviews={true}
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
          contentContainerStyle={{
            paddingBottom: 150,
          }}
        />
        <LinearGradient
          colors={['transparent', colors.background]}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 150,
          }}
        />
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          backgroundStyle={{
            backgroundColor: 'rgba(43, 36, 53, 0.6)',
          }}
          handleIndicatorStyle={{
            backgroundColor: 'rgba(255, 255, 255, 1)',
          }}>
          <BottomSheetView>
            <Text style={styles.h1}>Awesome</Text>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
