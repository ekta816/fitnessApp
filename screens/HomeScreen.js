import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Stats from '../components/Stats';


const HomeScreen = () => {
  const [workouts, setWorkouts] = useState([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [showStats, setShowStats] = useState(false);


  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('workouts');
        const savedWorkouts = jsonValue != null ? JSON.parse(jsonValue) : [];
        setWorkouts(savedWorkouts);

        const workoutCount = savedWorkouts.length;
        const durationSum = savedWorkouts.reduce((acc, workout) => acc + workout.duration, 0);
        const distanceSum = savedWorkouts.reduce((acc, workout) => {
          const distance = parseFloat(workout.distance) || 0;
          return acc + distance;
        }, 0);

        setTotalWorkouts(workoutCount);
        setTotalDuration(durationSum);
        setTotalDistance(distanceSum);
      } catch (e) {
        console.error('Failed to load workouts:', e);
      }
    };

    loadWorkouts();
  }, []);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} h ${mins} m`;
  };

  return (
    <View style={styles.container}>
      {
        showStats ?
        // stats screen
          <Stats
            workouts={workouts}
            close={setShowStats}
          /> :
          <>
          {/* display summary totals of all workouts */}
            <View style={styles.titles}>
              <Text style={styles.summaryTitle}>Summary</Text>
            </View>
            <View style={styles.summary}>
              <View style={styles.summarySubSection}>
                <Text style={styles.metric}>{totalWorkouts}</Text>
                <Text style={styles.type}>Workouts</Text>

              </View>
              <View style={styles.summarySubSection}>
                <Text style={styles.metric}>{formatDuration(totalDuration)}</Text>
                <Text style={styles.type}>Duration</Text>
              </View>
              <View style={styles.summarySubSection}>
                <Text style={styles.metric}>{totalDistance} miles</Text>
                <Text style={styles.type}>Distance</Text>
              </View>


            </View>
            {/* navigate to stats screen */}
            <TouchableOpacity style={styles.button} onPress={() => setShowStats(true)}>
              <Text style={styles.buttonText}>Stats</Text>
            </TouchableOpacity>
          </>
      }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#f0f0f0",
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  metric: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  type: {
    fontSize: 14,

  },
  titles: {
    alignItems: 'center',
    marginBottom: 100,
  },
  summary: {
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 10
  },
  summarySubSection: {
    margin: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },
  button: {
    alignSelf: 'center',
    padding: 10,
    backgroundColor: "#47aeec",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 40,
    width: "35%"
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default HomeScreen;
