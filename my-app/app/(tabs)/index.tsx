import { Text, View, SafeAreaView, SectionList } from 'react-native';
import { colors, styles } from '../../styles';
import Header from '../../components/header';
import EntryView from 'components/entryview';
import SearchBar from '../../components/searchbar';
import FilterSheet from 'components/filtersheet';
import Toggle from 'components/toggle';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { fetchAllEntriesTest } from 'db/queries';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Calendar, DateData } from 'react-native-calendars';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [groupedEntries, setGroupedEntries] = useState([]);
  const [tagFilters, setTagFilters] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [dayEntries, setDayEntries] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [view, setView] = useState('list');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  // Fetches the ids from the database
  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchEntries = async () => {
        try {
          const data = await fetchAllEntriesTest();
          setEntries(data);
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

  const markedDates = useMemo(() => {
    const marks = entries.reduce((acc, entry) => {
      const dateString = entry.time.split('T')[0];
      if (!acc[dateString]) {
        acc[dateString] = { dots: [], marked: true };
      }
      // Add a dot for each entry on a specific day
      acc[dateString].dots.push({ key: entry.entry_id, color: colors.accent });
      return acc;
    }, {});

    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
      };
    }
    return marks;
  }, [entries, selectedDate]);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    const entriesForDay = entries.filter((entry) => entry.time.startsWith(day.dateString));
    setDayEntries(entriesForDay);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <GestureHandlerRootView
        style={[styles.container, { backgroundColor: 'rgba(43, 36, 53, 0.5)' }]}>
        <Header />
        {/* Title Header */}
        <Text style={styles.h7}>Journal Entries</Text>
        {/* Search bar */}
        <SearchBar setSearchValue={setSearchValue} openFilters={openFilters} />
        {/* Toggle between list view and calendar view */}
        <Toggle option1={'list'} option2={'calendar'} returnValue={setView} />
        {/* List of entries */}
        {view === 'list' && (
          <View>
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
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.h1}>{title}</Text>
              )}
              initialNumToRender={2}
              maxToRenderPerBatch={5}
              windowSize={3}
              removeClippedSubviews={true}
              ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
              contentContainerStyle={{
                paddingBottom: 325,
              }}
            />
          </View>
        )}
        {/* Calendar view */}
        {view === 'calendar' && (
          <View style={{ flex: 1 }}>
            <Calendar
              style={{ backgroundColor: 'transparent' }}
              theme={{
                calendarBackground: 'transparent',
                monthTextColor: colors.text,
                dayTextColor: colors.text,
                selectedDayBackgroundColor: colors.accent,
                selectedDayTextColor: '#ffffff',
                textDisabledColor: colors.text + '80',
                arrowColor: colors.text,
                todayTextColor: colors.accent,
              }}
              enableSwipeMonths={true}
              markingType="multi-dot"
              markedDates={markedDates}
              onDayPress={onDayPress}
            />
            {dayEntries.length > 0 && (
              <View>
                <Text style={[styles.h2, { marginTop: 16, textAlign: 'center', opacity: 0.5 }]}>
                  Entries
                </Text>
                <SectionList
                  sections={[{ title: 'Entries', data: dayEntries }]}
                  keyExtractor={(item, index) => `${item.entry_id}-${index}`}
                  renderItem={({ item }) => (
                    <View style={{ marginBottom: 8, gap: 4, marginTop: 16 }}>
                      <EntryView
                        entry_id={item.entry_id}
                        icon={item.icon}
                        time={item.time}
                        content={item.content}
                        recording_id={item.recording_id}
                      />
                    </View>
                  )}
                  contentContainerStyle={{
                    paddingBottom: 325,
                  }}
                />
              </View>
            )}
            {selectedDate && dayEntries.length === 0 && (
              <Text style={[styles.h2, { marginTop: 16, textAlign: 'center', opacity: 0.5 }]}>
                No entries for this day.
              </Text>
            )}
          </View>
        )}
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
            <FilterSheet />
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
