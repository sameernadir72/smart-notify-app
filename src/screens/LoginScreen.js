import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/axiosConfig';
import { registerForPushNotifications } from '../utils/pushNotifications';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // 1. Hit your NestJS Backend
      const response = await api.post('/auth/login', { email, password });
      console.log("🚀 ~ handleLogin ~ response:", response)
      // 2. Extract and Save the JWT Token
      const token = response.data.access_token;
      await AsyncStorage.setItem('access_token', token);

      // 3. Register this device for push notifications
      registerForPushNotifications();

      // 4. Navigate to Dashboard
      navigation.replace('Dashboard');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
      console.error(error);
    }
  };

  return (
    // when I open the keyboard, the input fields should not be hidden
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
    <View style={styles.container}>
      <Text style={styles.title}>Smart Notify 🧠</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button title="Login" onPress={handleLogin} />
      
      <Text 
        style={styles.link} 
        onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Sign up
      </Text>
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 },
  link: { color: 'blue', textAlign: 'center', marginTop: 20 }
});