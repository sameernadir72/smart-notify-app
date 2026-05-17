import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/axiosConfig';

export default function DashboardScreen({ navigation }: any) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    // 1. Delete the token from the phone
    
    await AsyncStorage.removeItem('access_token');

    // 2. Navigate back to Login (using 'replace' so they can't swipe back!)
    navigation.replace('Login');
  };

  // --- FETCH TASKS LOGIC ---
  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Run fetchTasks every time the screen is opened
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTasks();
    });
    return unsubscribe;
  }, [navigation]);

  // --- COMPLETE TASK LOGIC ---
  const markCompleted = async (id: number) => {
    try {
      await api.patch(`/tasks/${id}`, { is_completed: true });
      fetchTasks(); // Refresh the list after completing
    } catch (error) {
      console.error(error);
    }
  };

  const renderTask = ({ item }: { item: any }) => (
    <View style={[styles.taskCard, item.is_completed && styles.completedCard]}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskMood}>Mood: {item.mood}</Text>

      {/* Show the AI Suggestion if it exists! */}
      {item.ai_suggestion ? (
        <Text style={styles.taskAi}>🤖 {item.ai_suggestion}</Text>
      ) : null}

      <Text style={styles.taskDate}>
        Due: {new Date(item.due_date).toLocaleString()}
      </Text>

      {!item.is_completed && (
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => markCompleted(item.id)}
        >
          <Text style={styles.btnText}>Mark Completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER SECTION WITH LOGOUT BUTTON */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Your Tasks</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* TASK LIST */}
      {loading ? (
        <Text style={styles.loadingText}>Loading tasks...</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id.toString()}
          renderItem={renderTask}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No tasks yet. Tap + to create one!
            </Text>
          }
        />
      )}

      {/* FLOATING ACTION BUTTON (To Add Task) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  logoutBtn: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: 'white', fontWeight: 'bold' },

  taskCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  completedCard: { opacity: 0.5 },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  taskMood: { fontStyle: 'italic', color: '#666', marginTop: 5 },
  taskAi: {
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
    color: '#0D47A1',
    fontWeight: '500',
  },
  taskDate: { color: '#E53935', marginTop: 8, fontWeight: 'bold' },

  completeBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 12,
  },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },

  loadingText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2196F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { color: 'white', fontSize: 30, fontWeight: 'bold', marginTop: -2 },
});
