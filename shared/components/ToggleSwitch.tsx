import React, { useState } from 'react';
import { View, StyleSheet, Switch, Text } from 'react-native';

interface ToggleSwitchProps {
  label: string;
  onValueChange: (value: boolean) => void;
}


export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, onValueChange }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    onValueChange(!isEnabled);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default ToggleSwitch;