import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddANewWorkoutScreen from './AddANewWorkout';
import WorkoutItem from '../components/WorkoutItem';
import RNPickerSelect from 'react-native-picker-select';



const WorkoutScreen = () => {
  const [workouts, setWorkouts] = useState(workouts);
  const [showAddWorkoutScreen, setShowAddWorkoutScreen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editing, setEditing] = useState(false);
  const [sortBy, setSortBy] = useState('dateDescending');
 
  // load initial workouts from asyncstorage
  // workout array example: 
  // const sampleWorkouts = [
  // {
  // "date": 1727406312, 
  // "distance": 1, 
  // "duration": 32, 
  // "workout_type": "Swimming"
  //  }, 
  // {
  //   "date": 1727147340, 
  //   "distance": 2.5, 
  //   "duration": 60, 
  //   "workout_type": "Walking"
  // },]
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('workouts');
        const savedWorkouts = jsonValue != null ? JSON.parse(jsonValue) : [];

        const sortedWorkouts = [...savedWorkouts].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setWorkouts(sortedWorkouts);

      } catch (e) {
        console.error('Failed to load workouts:', e);
      }
    };

    loadWorkouts();
  }, []);




  const handleAddWorkout = () => {
    setShowAddWorkoutScreen(true);
  };

  const handleCloseWorkout = (workouts) => {
    setShowAddWorkoutScreen(false);
    sortWorkouts(sortBy, workouts)
  };



  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setEditing(true);
    setShowAddWorkoutScreen(true);
  };

  const handleDeleteWorkout = async (workoutToDelete) => {
    try {
      const updatedWorkouts = workouts.filter(
        (workout) => workout !== workoutToDelete
      );
      setWorkouts(updatedWorkouts);
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    } catch (e) {
      console.error('Failed to delete workout:', e);
    }
  };

  const sortWorkouts = (criteria, workouts) => {
    const sortedWorkouts = [...workouts].sort((a, b) => {
      switch (criteria) {
        case 'dateDescending':
          return new Date(b.date) - new Date(a.date); // Sort by date, most recent first
        case 'dateAscending':
          return new Date(a.date) - new Date(b.date); // Sort by date, oldest first
        case 'distanceLongest':
          return b.distance - a.distance; // Sort by longest distance to shortest
        case 'distanceShortest':
          return a.distance - b.distance; // Sort by shortest distance to longest
        default:
          return 0;
      }
    });
    setWorkouts(sortedWorkouts);
  };

  const handleSortChange = (criteria) => {
    sortWorkouts(criteria, workouts);
    setSortBy(criteria);
  };

  // workout screen display a list of all workouts, and has a button to navigate to add a new workout or edit a workout
  // delete button allows user to directly delete workout
  return (
    <View style={styles.container}>
      {
        showAddWorkoutScreen ?
          <AddANewWorkoutScreen
            close={handleCloseWorkout}
            existingWorkout={editingWorkout}
            isEditing={editing}
            setIsEditing={setEditing}
          />
          :
          <>
            <Text style={styles.title}>Workouts</Text>
            <RNPickerSelect
              onValueChange={handleSortChange}
              items={[
                { label: 'Sort: Date (Most Recent)', value: 'dateDescending' },
                { label: 'Sort: Date (Oldest)', value: 'dateAscending' },
                { label: 'Sort: Distance (Longest)', value: 'distanceLongest' },
                { label: 'Sort: Distance (Shortest)', value: 'distanceShortest' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'Sort', value: null }}
              value={sortBy}
            />
            {
              workouts?.length > 0 ?
                <FlatList
                  data={workouts}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }, index) =>
                    <WorkoutItem
                      workout={item}

                      onEdit={handleEditWorkout}
                      onDelete={handleDeleteWorkout}
                    />}
                /> :
                <View>
                  <Text style={styles.noWorkoutText}>No Workouts Yet</Text>
                </View>
            }
            <TouchableOpacity style={styles.button} onPress={handleAddWorkout} >
              <Text style={styles.buttonText}>Add Workout</Text>
            </TouchableOpacity>

          </>
      }
    </View>
  );
};

const statusBarHeight = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginTop: statusBarHeight,
  },
  noWorkouts: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: statusBarHeight,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  workout: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff'
  },
  workoutText: {
    fontSize: 16
  },
  noWorkoutText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 40
  },
  button: {
    padding: 10,
    backgroundColor: "#47aeec",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  sortButton: {
    backgroundColor: "#47aeec",
    padding: 10,
    borderRadius: 5,
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 14,
  }
});


const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    marginHorizontal: 20,
    marginBottom: 10,
  },
};
export default WorkoutScreen;
