import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useRouter } from 'expo-router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Пожалуйста, заполните все поля');
      return;
    }

    setErrorMessage('');
    console.log('Авторизация завершена');
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Input
        label="Логин"
        placeholder="Введите логин"
        value={username}
        onChangeText={setUsername}
      />
      <Input
        label="Пароль"
        placeholder="Введите пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <Button title="Войти" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#25292e',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});
