import React from 'react';
import {StyleSheet, View} from 'react-native';
import CircleNavigation from './CircleNavigation';

const App = () => {
  return (
    <>
      <View style={styles.wrapper}>
        <CircleNavigation
          diameter={100}
          initialComponentScaleTo={0.8}
          options={[
            {text: 'GRAY'},
            {text: 'BLUE'},
            {text: 'RED'},
            {text: 'YELLOW'},
            {text: 'GREEN'},
          ]}>
          <View style={styles.circle} />
        </CircleNavigation>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  circle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#222',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
