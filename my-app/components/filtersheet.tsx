import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { colors, styles } from 'styles';
import { fetchAllTags } from 'db/queries';
import Tag from 'components/tag';


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
  }, []);

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
    <View style={[styles.container, {backgroundColor: 'transparent'}]}>
      <Text style={[styles.h6, { textAlign: 'center' }]}>Filters</Text>
      {/* Date range picker */}
      <View>
        <Text style={[styles.h6, { opacity:.5 }]}>Date</Text>

      </View>
      {/* Moods */}
      <View style={{ marginBottom: 16, gap: 4 }}>
        <Text style={[styles.h6, { opacity:.5 }]}>Moods</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {moods.map((mood) => (
            <Tag
              key={mood.tagId}
              tag={mood.name}
              color1={mood.color}
              onPress={() => {}}
              type="mood"
              active={tagFilters.includes(mood.tagId)}/>
          ))}


        </View>

      </View>
      {/* People */}
      <View>
        <Text style={[styles.h6, { opacity:.5 }]}>People</Text>

      </View>
    </View>
  );
}
