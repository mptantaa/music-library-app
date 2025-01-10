export const useRouter = () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  });
  
  export const useFocusEffect = jest.fn();
  export const useLocalSearchParams = jest.fn(() => ({}));
  