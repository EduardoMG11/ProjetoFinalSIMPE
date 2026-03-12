import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Pressable, Image } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

type Props = {
    progress: SharedValue<number>;
};

export const Chevron = ({ progress }: Props) => {
    const IconSyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${progress.value * -180}deg` }]
    }));

    return (
        <Animated.View style={IconSyle}>
            <Image 
                source={require('../../../assets/chevron.png')}  
                style={styles.chevron}
            />
        </Animated.View>
    );
};

export default Chevron;

const styles = StyleSheet.create({
    chevron: {
        width: 20,
        height: 20,
    }
});