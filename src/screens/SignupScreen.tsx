import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../api/axiosConfig';

export default function SignupScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            await api.post('/auth/signup', { email, password });
            Alert.alert('Success', 'Account created! Please log in.');
            navigation.navigate('Login');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Already have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignContent: 'center', padding: 20 },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 },
    link: { color: 'blue', textAlign: 'center', marginTop: 20 },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8 },
    buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
    linkText: { color: '#007AFF', textAlign: 'center', marginTop: 20 },
});