import { Text, View, SectionList } from 'react-native';
import { colors, styles } from '../../styles';
import Header from '../../components/header';
import EntryView from 'components/entryview';
import SearchBar from '../../components/searchbar';
import FilterSheet from 'components/filtersheet';
import Toggle from 'components/toggle';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { fetchAllEntries } from 'db/queries';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Calendar, DateData } from 'react-native-calendars';
import { parseMonth } from 'components/utils';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FloatingAction, IActionProps } from 'react-native-floating-action';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  // Reactively fetch entries from the database. Data will update automatically on changes.
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [tagFilters, setTagFilters] = useState<number[]>([]);

  // Debounce search input to reduce database queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Create a stable query object that changes when search or tags change
  const queryObject = useMemo(() => {
    console.log('Creating new query object with:', { debouncedSearchValue, tagFilters });
    return fetchAllEntries({ 
      query: debouncedSearchValue, 
      tag_ids: tagFilters, 
      pin: 0 
    });
  }, [debouncedSearchValue, tagFilters]);

  // Use regular state instead of useLiveQuery to test if that's the issue
  const [entries, setEntries] = useState([]);
  
  // Fetch entries when query changes
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // Execute the Drizzle query object
        const result = await queryObject.all();
        setEntries(result || []);
      } catch (error) {
        console.error('Error fetching entries:', error);
        setEntries([]);
      }
    };

    fetchEntries();
  }, [queryObject]);

  // Debug logging (reduced frequency for performance)
  useEffect(() => {
    console.log('=== SEARCH DEBUG ===');
    console.log('Search value:', searchValue);
    console.log('Debounced search value:', debouncedSearchValue);
    console.log('Tag filters:', tagFilters);
    console.log('Entries found:', entries.length);
    if (entries.length > 0) {
      console.log('First entry sample:', {
        id: entries[0].entry_id,
        title: entries[0].title,
        content: entries[0].content?.substring(0, 50),
        time: entries[0].time
      });
    } else {
      console.log('No entries found - this might indicate a filtering issue');
    }
    console.log('===================');
  }, [searchValue, debouncedSearchValue, tagFilters, entries.length]);

  const [selectedDate, setSelectedDate] = useState('');
  const [dayEntries, setDayEntries] = useState([]);
  const [view, setView] = useState('list');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  const router = useRouter();

  // Groups the entries based on month
  const groupedEntries = useMemo(() => {
    if (!entries || entries.length === 0) return [];

    try {
      // Sort entries in descending order (most recent first)
      const sortedEntries = [...entries].filter(entry => entry && entry.time).sort((a, b) => {
        try {
          const dateA = new Date(a.time).getTime();
          const dateB = new Date(b.time).getTime();
          return dateB - dateA;
        } catch (error) {
          console.error('Error sorting entries:', error);
          return 0;
        }
      });

      // Group by month/year
      const grouped = sortedEntries.reduce(
        (acc, entry) => {
          try {
            if (!entry || !entry.time) return acc;
            
            const date = new Date(entry.time);
            if (isNaN(date.getTime())) return acc; // Skip invalid dates
            
            const monthYear = date.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            });

            if (!acc[monthYear]) acc[monthYear] = [];
            acc[monthYear].push(entry);
          } catch (error) {
            console.error('Error processing entry for grouping:', error, entry);
          }

          return acc;
        },
        {} as Record<string, typeof entries>
      );

      // Format for SectionList
      return Object.keys(grouped).map((month) => ({
        title: month,
        data: grouped[month],
      }));
    } catch (error) {
      console.error('Error in groupedEntries:', error);
      return [];
    }
  }, [entries]);

  // Memoized render functions to prevent unnecessary re-renders
  const renderItem = useCallback(({ item }: { item: any }) => {
    // Add null checks to prevent crashes
    if (!item || !item.entry_id || !item.time) {
      console.warn('Invalid entry item:', item);
      return null;
    }

    return (
      <View style={{ marginBottom: 8, gap: 4 }}>
        <Text style={[styles.h2, { opacity: 0.5 }]}>
          {item.time ? parseMonth(item.time) : 'Unknown Date'}
        </Text>
        <EntryView
          entry_id={item.entry_id}
          icon={item.icon}
          title={item.title}
          time={item.time}
          content={item.content}
          recording_id={item.recording_id}
        />
      </View>
    );
  }, []);

  const renderSectionHeader = useCallback(({ section: { title } }: { section: { title: string } }) => (
    <Text style={styles.h1}>{title}</Text>
  ), []);

  const keyExtractor = useCallback((item: any, index: number) => `${item.entry_id}-${index}`, []);

  const ItemSeparatorComponent = useCallback(() => <View style={{ height: 4 }} />, []);

  // Memoized calendar render item function
  const renderCalendarItem = useCallback(({ item }: { item: any }) => {
    // Add null checks to prevent crashes
    if (!item || !item.entry_id || !item.time) {
      console.warn('Invalid calendar entry item:', item);
      return null;
    }

    return (
      <View style={{ marginBottom: 8, gap: 4, marginTop: 16 }}>
        <EntryView
          entry_id={item.entry_id}
          icon={item.icon}
          time={item.time}
          title={item.title}
          content={item.content}
          recording_id={item.recording_id}
        />
      </View>
    );
  }, []);

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

  // Handles assigning date marks to the calendar days
  const markedDates = useMemo(() => {
    if (!entries || entries.length === 0) {
      return {};
    }

    const marks = entries.reduce((acc, entry) => {
      // Add null checks for entry and entry.time
      if (!entry || !entry.time) {
        return acc;
      }

      try {
        const dateString = entry.time.split('T')[0];
        if (!acc[dateString]) {
          acc[dateString] = { dots: [], marked: true };
        }
        // Add a dot for each entry on a specific day
        acc[dateString].dots.push({ key: entry.entry_id, color: colors.accent });
      } catch (error) {
        console.error('Error processing entry time:', error, entry);
      }
      
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

  // Handles switching between days
  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    if (!entries || entries.length === 0) {
      setDayEntries([]);
      return;
    }
    
    const entriesForDay = entries.filter((entry) => {
      if (!entry || !entry.time) return false;
      return entry.time.startsWith(day.dateString);
    });
    setDayEntries(entriesForDay);
  };

  // Update the tag filters
  const updateTagFilters = (tag_id: number) => {
    const newTagFilters = tagFilters.includes(tag_id)
      ? tagFilters.filter((id) => id !== tag_id)
      : [...tagFilters, tag_id];
    setTagFilters(newTagFilters);
  };

  // Options for floating action button
  const actions: IActionProps[] = [
    {
      name: 'bt_add_entry',
      text: 'Add Entry',
      color: colors.accent,
      icon: <FontAwesome name="plus" size={20} color={colors.text} />,
    },
    {
      name: 'bt_add_alarm',
      text: 'Add Alarm',
      color: colors.accent,
      icon: <FontAwesome name="bell" size={20} color={colors.text} />,
    },
  ];

  // Actions for each floating action option
  const handleFloatingActionPress = (name?: string) => {
    switch (name) {
      // Add a new entry
      case 'bt_add_entry':
        console.log('Add entry');
        // New entry id is initially -1, changes to actual id when user makes a change
        router.push(`entry/${-1}`);
        break;
      // Add a new alarm
      case 'bt_add_alarm':
        console.log('Add alamr');
        break;
    }
  };

  const test = () => {};

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
              sections={groupedEntries.filter(section => section.data && section.data.length > 0)}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              initialNumToRender={5}
              maxToRenderPerBatch={3}
              windowSize={5}
              removeClippedSubviews={true}
              ItemSeparatorComponent={ItemSeparatorComponent}
              contentContainerStyle={{
                paddingBottom: 325,
              }}
              getItemLayout={(data, index) => ({
                length: 120, // Approximate height of each item
                offset: 120 * index,
                index,
              })}
              updateCellsBatchingPeriod={50}
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
                  sections={[{ title: 'Entries', data: dayEntries.filter(entry => entry && entry.entry_id) }]}
                  keyExtractor={keyExtractor}
                  renderItem={renderCalendarItem}
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
            <FilterSheet
              tagFilters={tagFilters}
              setTagFilters={updateTagFilters}
              setDateRange={test}
              clearSearch={() => setSearchValue('')}
            />
          </BottomSheetView>
        </BottomSheet>
        <FloatingAction
          actions={actions}
          onPressItem={handleFloatingActionPress}
          distanceToEdge={{ vertical: 110, horizontal: 30 }}
          color={colors.accent}
          shadow={{ shadowOpacity: 0, shadowRadius: 0 }}
          overlayColor="rgba(0, 0, 0, .6)"
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
