import { Text, View } from 'react-native';
import { styles } from '../styles';

export const EditScreenInfo = ({ path }: { path: string }) => {
  const title = 'Open up the code for this screen:';
  const description =
    'Change any of the text, sfsdfsfsave the file, andvxcvxvxvxvxcx your app will automatically update.';

  return (
    <View>
        <Text className={styles.h1}>{title}</Text>
        <Text className="text-text opacity-50">{title}</Text>

        <Text className={styles.h2}>{description}</Text>

    </View>
  );
};
