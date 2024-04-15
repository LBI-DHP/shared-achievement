import React from 'react';
import { useEffect } from 'react';
import { View, StyleSheet, Text } from "react-native";
import Svg, { G, Circle } from "react-native-svg";

const DonutChart = (props) => {
    const {
        teamAbsoluteStepGoal,
        teamAbsoluteStepCountToday,
        teamMembersAndStepCountOfToday,
        update
    } = props;

    const radius = 70;
    const circleCircumference = 2 * Math.PI * radius;

    const data = [];

    useEffect(() => {
        teamMembersAndStepCountOfToday.forEach((member, i) => {
            data.push({
                color: member.color,
                percentage: calculatePercentage(member.sumSteps),
            });
        });
    }, [update]);

    teamMembersAndStepCountOfToday.forEach((member, i) => {

        data.push({
            color: member.color,
            percentage: calculatePercentage(member.sumSteps),
        });
    });

    function calculatePercentage(sumSteps) {
        return (sumSteps / teamAbsoluteStepGoal) * 100 || 0.0001;
    }

    function calculateStrokeDashoffset(percentage) {
        const result = circleCircumference - (circleCircumference * percentage) / 100;
        return Number.isFinite(result) ? result : 0;
    }


    function calculateAngle(percentage) {
        return (percentage / 100) * 360;
    }

    function formatNumberWithDot(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return (
        <View style={styles.container}>
            <View style={styles.graphWrapper}>
                <Svg height="250" width="250" viewBox="0 0 180 180">
                    <G rotation={-90} originX="90" originY="90">
                        <Circle
                            cx="50%"
                            cy="50%"
                            r={radius}
                            stroke="#DDDDDD"
                            fill="transparent"
                            strokeWidth="25"
                        />
                        {data.map((element, index) => (
                            <Circle
                                key={index}
                                cx="50%"
                                cy="50%"
                                r={radius}
                                stroke={element.color}
                                fill="transparent"
                                strokeWidth="25"
                                strokeDasharray={circleCircumference}
                                strokeDashoffset={calculateStrokeDashoffset(element.percentage)}
                                rotation={calculateAngle(
                                    data.slice(0, index).reduce((sum, el) => sum + el.percentage, 0)
                                )}
                                originX="90"
                                originY="90"
                            />
                        ))}
                    </G>
                </Svg>
                <Text style={styles.label1}>
                    {formatNumberWithDot(teamAbsoluteStepCountToday) + " / " + formatNumberWithDot(teamAbsoluteStepGoal)}
                </Text>
                <Text style={styles.label2}>{"steps"}</Text>
            </View>
        </View>
    );
};

export default DonutChart;

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    graphWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    label1: {
        position: "absolute",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 15,
        color: "#082032",
    },
    label2: {
        paddingTop: 40,
        position: "absolute",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 15,
        color: "#082032",
    },
});
