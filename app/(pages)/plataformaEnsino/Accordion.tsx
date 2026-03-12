import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Category } from './data';
import { useVideoPlayer, VideoView } from 'expo-video';
import Chevron from './Chevron';
import Animated, { Extrapolate, interpolate, measure, runOnUI, useAnimatedRef, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

type Props = {
    value: Category;
};

const Accordion = ({ value }: Props) => {
    const listRef = useAnimatedRef<View>(); 
    const heightValue = useSharedValue(0);
    const open = useSharedValue(false);
    const player: any = useVideoPlayer(value.videofi, (player) => {
        player.loop = false;
        player.pause(); 
    });

    const progress = useDerivedValue(() => {
        return open.value ? withTiming(1) : withTiming(0);
    });

    const heightAnimationStyle = useAnimatedStyle(() => ({
        height: withTiming(open.value ? heightValue.value : 0),
        opacity: withTiming(open.value ? 1 : 0),
    }));

    return (
        <View style={styles.container}>
            <Pressable 
                style={styles.titleContainer}
                onPress={() => {
                    if (heightValue.value === 0) {
                        runOnUI(() => {
                            'worklet';
                            const measured = measure(listRef);
                            if (measured) {
                                heightValue.value = measured.height;
                            }
                        })();
                    }
                    open.value = !open.value;
                }}
            >
                <Text style={styles.textTitle}>{value.title}</Text>
                <Chevron progress={progress} />
            </Pressable>

            <Animated.View style={[styles.overflowHidden, heightAnimationStyle]}>
                <View ref={listRef} style={styles.contentInternal}>
                    {value.videofi && (
                        <VideoView 
                           player={player as any} 
                           style={styles.video as any} 
                           {...({
                                allowsFullscreen: true,
                                allowsPictureInPicture: true,
                                contentFit: 'cover'
                            } as any)}
                        />
                       )}
                    {value.description.map((v, i) => (
                        <View key={i} style={styles.content}>
                            <Text style={styles.textContent}>{v.main}</Text>
                            
                            {v.sub.map((item, j) => (
                                <Text key={j} style={styles.textContentSub}>
                                    {item}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
};

export default Accordion;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3a557a',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 14,
        borderColor: '#C9D6E3',
        borderWidth: 1,
        overflow: 'hidden',
    },

    titleContainer: {
        padding: 20,
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#E3EDFB',
        zIndex: 2,
    },

    textTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    overflowHidden: {
        overflow: 'hidden',
    },

    contentInternal: {
        width: '100%',
        position: 'absolute',
    },

    content: {
        padding: 20,
        backgroundColor: '#D6E1F0',
    },

    textContent: {
        fontSize: 14,
        color: '#333',
    },

    textContentSub: {
        fontSize: 12,
        color: '#555',
        marginTop: 5,
    },
    video: {
        width:"100%",
        height: 200,
        backgroundColor: '#000',
    },
    
    });



