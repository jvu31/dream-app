import { Text, View, SafeAreaView, SectionList } from 'react-native';
import { colors, styles } from '../../styles';
import Header from '../../components/header';
import EntryView from 'components/entryview';
import { useState, useEffect } from 'react';
import { fetchAllEntriesTest } from 'db/queries';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [groupedEntries, setGroupedEntries] = useState([]);

  useEffect(() => {
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
  }, []);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: 'rgba(43, 36, 53, 0.5)' }]}>
        <Header />
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
      </View>
    </SafeAreaView>
  );
}
