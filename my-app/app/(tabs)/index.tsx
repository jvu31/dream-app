import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { colors, styles } from '../../styles';
import Header from '../../components/header';
import EntryView from 'components/entryview';

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, zIndex: -2 }}>
      {/* Overlay with secondary color at 0.5 opacity */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: colors.secondary, opacity: 1, zIndex: -1 },
        ]}
      />

      {/* Content (fully opaque) */}
      <View style={[styles.container, { }]}>
        <Header />
        <Text style={[styles.h1, {opacity: .5}]}>June 2025</Text>
        <Text style={styles.h2}>June 25, 2025</Text>
        <Text style={styles.h3}>So today I woke feeling like shit man</Text>
        <Text style={styles.h4}>So today I wokefdsfsd feeling like</Text>
        <Text style={styles.h5}>So today I wokefdsfsd feeling like</Text>
        <EntryView />
      </View>
    </SafeAreaView>
  );
}
