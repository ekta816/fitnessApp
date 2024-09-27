import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import moment from 'moment';


const Stats = ({ workouts, close }) => {
    const colors = [
        "#3fb09b",
        "#eaa451",
        "#3f83b0",
        "#eadc51",
        "#3f50b0",
        "#663fb0",
        "#c7ea51",
        "#b03f79",
        "#3fb06c",
        "#ea6d51",
    ];

    const workoutCounts = workouts.reduce((acc, workout) => {
        const type = workout.workout_type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const exerciseTimesByDate = workouts
        .sort((a, b) => a.date - b.date)
        .reduce((acc, workout) => {
            const duration = workout.duration;
            const formattedDate = moment.unix(workout.date).format('MMM Do');

            if (formattedDate && typeof duration === 'number' && duration >= 0) {
                acc[formattedDate] = (acc[formattedDate] || 0) + parseInt(duration);
            }

            return acc;
        }, {});


    const chartData = Object.keys(workoutCounts).map((type, index) => ({
        name: type,
        count: workoutCounts[type],
        color: colors[index % colors.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
    }));

   
    const recentDates = Object.keys(exerciseTimesByDate)
    .sort((b, a) => moment(b, 'MMM Do') - moment(a, 'MMM Do'))
    .slice(0, 5);

    const filteredExerciseTimes = Object.fromEntries(
        recentDates.map(date => [date, exerciseTimesByDate[date]])
    );

    const barChartData = {
        labels: Object.keys(filteredExerciseTimes),
        datasets: [
            {
                data: Object.values(filteredExerciseTimes),
            },
        ],
    };

    const totalWorkouts = workouts.length;
    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>

                <Text style={styles.title}>Stats</Text>

                <TouchableOpacity style={styles.cancelButton} onPress={() => close(false)}>
                    <Text style={styles.cancelButtonText}>X</Text>
                </TouchableOpacity>
            </View>
            {/* Pie chart showing workout types */}
            <Text style={styles.title}>Workout Types</Text>
            <PieChart
                data={chartData}
                width={screenWidth - 80}
                height={220}
                chartConfig={{

                    decimalCount: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
            />
            <View style={styles.seperator}></View>
            {/* Bar chart showing exercise durations over time */}
            <Text style={styles.title}>Exercise Durations</Text>
            <BarChart
                data={barChartData}
                width={screenWidth - 40}
                height={220}
                yAxisLabel=""
                chartConfig={{

                    decimalPlaces: 0,
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(0, 143, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,

                    }
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 30
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,

    },
    totalText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    cancelButton: {
        marginRight: 5,
        marginTop: 10
    },
    cancelButtonText: {
        fontSize: 18
    },
    seperator: {
        marginVertical: 20
    }
});

export default Stats;
