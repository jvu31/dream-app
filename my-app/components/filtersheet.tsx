import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors, styles } from 'styles';
import { fetchAllTags } from 'db/queries';
import Tag from 'components/tag';
import { groupTags } from 'components/utils';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { TagModel } from 'db/interfaces';

interface Props {
  tagFilters: number[];
  setTagFilters: (tags: number) => void;
  setDateRange: (dates: string[]) => void;
}

const FilterSheet = React.memo(function FilterSheet({
  tagFilters,
  setTagFilters,
  setDateRange,
}: Props) {
  const [tags, setTags] = useState<TagModel[]>([]);
  const [moods, setMoods] = useState<TagModel[]>([]);
  const [people, setPeople] = useState<TagModel[]>([]);

  // Fetches all the tags in the database
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await fetchAllTags();
        setTags(data);
        console.log('Tags fetched for the filter sheet!');
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  // Saves the mood and people tags from the fetched tags
  useEffect(() => {
    if (tags.length === 0) return;

    const grouped = groupTags(tags);

    setMoods(grouped['mood'] || []);
    setPeople(grouped['people'] || []);

    console.log('Tags grouped!');
  }, [tags]);

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <Text style={[styles.h6, { textAlign: 'center' }]}>Filters</Text>
      {/* Date range picker */}
      <View>
        <Text style={[styles.h6, { opacity: 0.5 }]}>Date</Text>
      </View>
      {/* Moods */}
      <View style={{ marginBottom: 16, gap: 4 }}>
        <Text style={[styles.h6, { opacity: 0.5 }]}>Moods</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {moods.map((mood) => (
            <Tag
              key={mood.tag_id}
                            tag_id={mood.tag_id}

              tag={mood.name}
              color1={mood.color}
              onPress={() => setTagFilters(mood.tag_id)}
              type="mood"
              active={tagFilters.length === 0 || tagFilters.includes(mood.tag_id)}
            />
          ))}
        </View>
      </View>
      {/* People */}
      <View style={{ marginBottom: 16, gap: 4 }}>
        <Text style={[styles.h6, { opacity: 0.5 }]}>People</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {people.map((person) => (
            <Tag
              key={person.tag_id}
              tag_id={person.tag_id}
              tag={person.name}
              color1={person.color}
              onPress={() => setTagFilters(person.tag_id)}
              type="people"
              active={tagFilters.length === 0 || tagFilters.includes(person.tag_id)}
            />
          ))}
        </View>
      </View>
    </View>
  );
});

export default FilterSheet;
