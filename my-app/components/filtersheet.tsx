import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { colors, styles } from 'styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { fetchAllTags } from 'db/queries';


interface Props {
  setTagFilters: (tags: number[]) => void;
  dateRange: (dates: string[]) => void;
}

export default function FilterSheet({}) {
  const [tagFilters, setTagFilters] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [moods, setMoods] = useState([]);
  const [people, setPeople] = useState([]);

  // Fetches all the tags in the database
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await fetchAllTags();
        setTagFilters(data);
        console.log('Tags fetched!');
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [])

  // Saves the mood and people tags from the fetched tags
  useEffect(() => {
    if (tagFilters.length === 0) return;

    const grouped = tagFilters.reduce((acc, entry) => {
      if (!acc[entry.type]) {
        acc[entry.type] = [];
      }
      acc[entry.type].push(entry);
      return acc;
    }, {});

    setMoods(grouped['mood'] || []);
    setPeople(grouped['people'] || []);

    console.log('Tags grouped!');
  }, [tagFilters]);

  return (
    <View>
      <Text>FilterSheet</Text>
    </View>
  );
}
