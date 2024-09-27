import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment';

const WorkoutItem = ({ workout, onEdit, onDelete }) => {
    const handleDelete = (workout) => {
        Alert.alert(
            'Delete Workout',
            'Are you sure you want to delete this workout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDelete(workout),
                },
            ],
            { cancelable: true }
        );
    };

    const handleEdit = () => {
        onEdit(workout);
    };
    // displays a single workout log
    return (
        <View style={styles.workout}>
            <Text style={styles.workoutText}>Workout: {workout.workout_type}</Text>
            <Text style={styles.workoutText}>
                Duration: {Math.floor(workout.duration / 60)} hr {workout.duration % 60} min
            </Text>
            <Text style={styles.workoutText}>Distance: {workout.distance} miles</Text>
            <Text style={styles.workoutText}>
                Date: {moment.unix(workout.date).format('dddd, MMM Do, YYYY, hh:mm A')}
            </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(workout)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    workout: {
        padding: 20,
        margin: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    workoutText: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    editButton: {
        padding: 5,
        backgroundColor: '#4caf50',
        borderRadius: 5,
        width: '20%',
        marginHorizontal: 2,
        alignItems: 'center',
    },
    deleteButton: {
        padding: 5,
        backgroundColor: '#e25f4d',
        borderRadius: 5,
        width: '20%',
        marginHorizontal: 2,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default memo(WorkoutItem);
