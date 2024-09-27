import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const AddANewWorkoutScreen = ({ close, existingWorkout = null, isEditing = false, setIsEditing }) => {
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // load initial workout fields if editing an existing workout
  useEffect(() => {
    if (isEditing && existingWorkout) {
      setWorkoutType(existingWorkout.workout_type.trim());
      setDuration(existingWorkout.duration.toString());
      setDistance(existingWorkout.distance.toString());
      setDate(moment.unix(existingWorkout.date).toDate());
      const totalHours = Math.floor(existingWorkout.duration / 60);
      const totalMinutes = existingWorkout.duration % 60;
      setDurationHours(totalHours.toString());
      setDurationMinutes(totalMinutes.toString());
    }
  }, [isEditing, existingWorkout]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    setDate(date);
  };


    // types of workouts
  const workoutOptions = [
    { label: 'Running', value: 'Running' },
    { label: 'Cycling', value: 'Cycling' },
    { label: 'Weight Lifting', value: 'Weight Lifting' },
    { label: 'Yoga', value: 'Yoga' },
    { label: 'Swimming', value: 'Swimming' },
    { label: 'HIIT', value: 'HIIT' },
    { label: 'Walking', value: 'Walking' },
    { label: 'Dancing', value: 'Dancing' },
    { label: 'Pilates', value: 'Pilates' },
    { label: 'Boxing', value: 'Boxing' },
  ];

  // validation of inputs
  const validateInputs = () => {

    if (!workoutType.trim() || workoutType === null) {
      Alert.alert('', 'Please enter a workout type.');
      return false;
    }
    if (!duration || isNaN(duration) || parseFloat(duration) <= 0) {
      Alert.alert('', 'Please enter a duration');
      return false;
    }
    if (!distance || distance.trim() === '' || isNaN(distance) || parseFloat(distance) < 0) {
      Alert.alert('', 'Please enter a distance 0 or greater');
      return false;
    }
    return true;
  };

  const handleSaveWorkout = async () => {
    if (!validateInputs()) return;

    const newWorkout = {
      workout_type: workoutType,
      duration: parseFloat(duration),
      distance: distance ? parseFloat(distance) : 0.0,
      date: moment(date).unix(),
    };

    try {
      const jsonValue = await AsyncStorage.getItem('workouts');
      const workouts = jsonValue != null ? JSON.parse(jsonValue) : [];

      if (isEditing) {
        const index = workouts.findIndex((workout) => workout.date === existingWorkout.date);
        workouts[index] = newWorkout;
      } else {
        workouts.push(newWorkout);
      }

      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
      if (isEditing) {
        setIsEditing(false);
      }
      Alert.alert('Success', isEditing ? 'Workout updated successfully!' : 'Workout saved successfully!');
      close(workouts);
    } catch (e) {
      console.error('Failed to save workout:', e);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  const closeCurrent = async () => {
    const jsonValue = await AsyncStorage.getItem('workouts');
    const workouts = jsonValue != null ? JSON.parse(jsonValue) : [];
    close(workouts)
  }

  const handleHoursChange = (hours) => {
    setDurationHours(hours);
    const totalMinutes = parseInt(hours || 0) * 60 + parseInt(durationMinutes || 0);
    setDuration(totalMinutes);
  };

  const handleMinutesChange = (minutes) => {
    setDurationMinutes(minutes);
    const totalMinutes = parseInt(durationHours || 0) * 60 + parseInt(minutes || 0);
    setDuration(totalMinutes);
  };

  // add workout page with input fields for type of workout, duration, date and distance.
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>

        <Text style={styles.title}>{isEditing ? 'Edit Workout' : 'Add New Workout'}</Text>

        <TouchableOpacity style={styles.cancelButton} onPress={() => closeCurrent()}>
          <Text style={styles.cancelButtonText}>X</Text>
        </TouchableOpacity>
      </View>
      <Text>Type</Text>
      <RNPickerSelect
        onValueChange={value => setWorkoutType(value)}
        items={workoutOptions}
        style={pickerSelectStyles}
        value={workoutType}
        placeholder={{ label: 'Select Workout Type', value: null }}
      />
      <Text style={styles.inputTitle}>Duration</Text>
      <View style={styles.duration}>

        <TextInput
          style={styles.input}
          placeholder="Duration (hours)"
          keyboardType="numeric"
          value={durationHours}
          onChangeText={handleHoursChange}
        />

        <TextInput
          style={styles.input}
          placeholder="Duration (minutes)"
          keyboardType="numeric"
          value={durationMinutes}
          onChangeText={handleMinutesChange}
        />
      </View>
      <Text>Distance</Text>
      <TextInput
        style={styles.inputDist}
        placeholder="Distance (miles)"
        keyboardType="numeric"
        value={distance}
        onChangeText={setDistance}
      />
      <View>
        <Text>Date</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker} >
          <Text style={styles.dateButtonText}>{moment(date).format('ddd, MMM D, YYYY')}</Text>

        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

      </View>
      <TouchableOpacity style={styles.button} onPress={handleSaveWorkout}>
        <Text style={styles.buttonText}>{isEditing ? 'Update Workout' : 'Save Workout'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  input: {
    height: 50,
    width: (screenWidth - 50) / 2,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  inputDist: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  dateButton: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    alignItems: 'center',
  },
  datePickerButton: {
    padding: 15,
    marginBottom: 20,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
  },
  date: {
    marginRight: 40
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    padding: 15,
    backgroundColor: '#47aeec',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  duration: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton: {
    marginRight: 5
  },
  cancelButtonText: {
    fontSize: 18
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    backgroundColor: '#fff',
    marginBottom: 20,
    marginTop: 2,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    backgroundColor: '#fff',
    marginBottom: 20,
    marginTop: 4,
  },
});
export default AddANewWorkoutScreen;
