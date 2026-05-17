jest.mock(
  'react-native/src/private/components/scrollview/HScrollViewNativeComponents',
  () => ({
    HScrollViewNativeComponent: 'ScrollView',
    HScrollContentViewNativeComponent: 'View',
  })
);
