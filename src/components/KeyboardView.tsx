import React from 'react';
import type { ViewStyle } from 'react-native';


import {KeyboardAwareScrollView as BaseKeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';


type KeyboardAwareScrollViewProps = BaseKeyboardAwareScrollView['props'] & {
  children: React.ReactNode;
  customStyle?: ViewStyle;
};

export const KeyboardAwareScrollView = ({
  children,
  customStyle,
}: KeyboardAwareScrollViewProps) => {
  return (
    <BaseKeyboardAwareScrollView
      contentContainerStyle={[{  }, customStyle]}
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}>
      {children}
    </BaseKeyboardAwareScrollView>
  );
};
