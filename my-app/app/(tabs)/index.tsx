import { Text, View, SafeAreaView, FlatList } from 'react-native';
import { colors, styles } from '../../styles';
import Header from '../../components/header';
import EntryView from 'components/entryview';
import { useState, useEffect, use } from 'react';
import { fetchAllEntriesTest } from 'db/queries';

export default function Home() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await fetchAllEntriesTest();
        setEntries(data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

  if (entries.length === 0) {
    return <Text>No entries found.</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: 'rgba(43, 36, 53, 0.5) ' }]}>
        <Header />
        <Text style={[styles.h1]}>June 2025</Text>
        <View style={{gap: 4}}>
          <Text style={[styles.h2, { opacity: 0.5 }]}>June 25, 2025</Text>
          <EntryView />
        </View>
        <FlatList data={entries} renderItem={({item}) => <EntryView />}/>

      </View>
    </SafeAreaView>
  );
}
