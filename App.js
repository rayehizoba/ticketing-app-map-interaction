import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
} from "react-native";

import MapView from "react-native-maps";

const Images = [
  { uri: "https://bit.ly/2ItD9rN" },
  { uri: "https://bit.ly/2IQot9m" },
  { uri: "https://i.ytimg.com/vi/8_96C9SDc1U/maxresdefault.jpg" },
  { uri: "https://bit.ly/2IsDIWA" }
]

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT * 1.3;

export default class screens extends Component {
  state = {
    markers: [
      {
        coordinate: {
          latitude: 45.524548,
          longitude: -122.6749817,
        },
        title: "Kanye West: Pablo tour XI",
        description: "3987 Owings Mills BLVD, Baltimore MD",
        dateTime: "26 April, 2018 21:00",
        image: Images[0],
      },
      {
        coordinate: {
          latitude: 45.524698,
          longitude: -122.6655507,
        },
        title: "Starboy World Tour",
        description: "3987 Owings Mills BLVD, Baltimore MD",
        dateTime: "26 April, 2018 21:00",
        image: Images[1],
      },
      {
        coordinate: {
          latitude: 45.5230786,
          longitude: -122.6701034,
        },
        title: "30 Billion concert",
        description: "3987 Owings Mills BLVD, Baltimore MD",
        dateTime: "26 April, 2018 21:00",
        image: Images[2],
      },
      {
        coordinate: {
          latitude: 45.521016,
          longitude: -122.6561917,
        },
        title: "The Dome. Abuja opening",
        description: "3987 Owings Mills BLVD, Baltimore MD",
        dateTime: "26 April, 2018 21:00",
        image: Images[3],
      },
    ],
    region: {
      latitude: 45.52220671242907,
      longitude: -122.6653281029795,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
  };

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }
  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.75, 1, 0.75],
        extrapolate: "clamp",
      });
      const colorOpacity = this.animation.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: "clamp",
      });
      const cardScale = this.animation.interpolate({
        inputRange,
        outputRange: [.85, 1, .85],
        extrapolate: "clamp",
      });
      return { scale, opacity, colorOpacity, cardScale };
    });

    return (
      <View style={styles.container}>
        <MapView
          ref={map => this.map = map}
          initialRegion={this.state.region}
          style={styles.mapView}
        >
          {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            const colorOpacityStyle = {
              opacity: interpolations[index].colorOpacity,
            };
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles.ring, scaleStyle]} />
                  <View style={[styles.marker]} />
                  <Animated.View style={[styles.markerActive, colorOpacityStyle]} />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>

        <View style={styles.scrollView}>
          <View style={{height: 75, flexDirection: 'row', padding: 15}}>
            <View style={{flex: 0.5, backgroundColor: '#efefef', height: 45, width: 45, borderRadius: 22}}>
            </View>
            <View style={{flex: 3}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>Welcome Thomas</Text>
              <Text style={{color: '#aaa', fontSize: 14}} >Find out what's happening around you.</Text>
            </View>
          </View>
          <Animated.ScrollView
            style={{flex: 1, overflow: 'visible'}}
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            snapToAlignment="start"
            decelerationRate="fast"
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.animation,
                    },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            contentContainerStyle={[styles.endPadding, styles.startPadding]}
          >
            {this.state.markers.map((marker, index) => {
              const cardScaleStyle = {
                transform: [
                  {
                    scale: interpolations[index].cardScale,
                  },
                ],
              };
              return (
                <Animated.View style={[styles.card, cardScaleStyle ]} key={index}>
                  <View style={styles.cardImage}>
                    <Image
                      source={marker.image}
                      style={{flex: 1}}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.textContent}>
                    <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                    <Text numberOfLines={1} style={styles.cardDescription}>
                      {marker.description}
                    </Text>
                    <Text numberOfLines={1} style={styles.cardCaption}>
                      {marker.dateTime}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </Animated.ScrollView>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1.5,
  },
  scrollView: {
    flex: 1,
    // paddingVertical: 10,
  },
  startPadding: {
    paddingLeft: 30,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    elevation: 2,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: .25,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    borderRadius: 5,
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
  },
  textContent: {
    flex: 1.5,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  cardtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardDescription: {
    fontSize: 12,
    color: "#999",
    paddingBottom: 15,
  },
  cardCaption: {
    fontSize: 10,
    color: "#999",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "black",
    position: "absolute",
    borderWidth: 1,
    borderColor: "white",
  },
  markerActive: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#80df38",
    borderWidth: 1,
    borderColor: "white",
  },
  ring: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0, 0.1)",
    position: "absolute",
  },
});