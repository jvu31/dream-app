import { StyleSheet } from 'react-native';

export const colors = {
  text: '#f9f9fb',
  background: '#101016',
  primary: '#615f86',
  secondary: '#2b2435',
  accent: '#5f4b6c',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    gap: 16,
    backgroundColor: colors.background,
  },
  h1: {
    fontWeight: '800',
    fontSize: 32,
    color: colors.text,
  },
  h2: {
    fontWeight: '400',
    fontSize: 20,
    color: colors.text,
  },
  h3: {
    fontSize: 24,
    color: colors.text,
  },
  h4: {
    fontWeight: '500',
    color: colors.text,
  },
  h5: {
    fontSize: 20,
    color: colors.text,
  },
  h6: {
    fontWeight: '800',
    fontSize: 24,
    color: colors.text,
  },

});

export default styles;
