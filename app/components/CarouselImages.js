import React from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "react-native-elements";
import Carousel from "react-native-banner-carousel";

export default function CarouselImages(props) {
  const { images, height, width } = props;
  return (
    <Carousel
      autoplay
      autoplayTimeout={5000}
      loop
      index={0}
      pageSize={width}
      pageIndicatorStyle={styles.indicator}
      activePageIndicatorStyle={styles.indicatorActive}
    >
      {images.map((image, index) => (
        <View key={index}>
          <Image style={{ height, width }} source={{ uri: image }} />
        </View>
      ))}
    </Carousel>
  );
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: "grey"
  },
  indicatorActive: {
    backgroundColor: "tomato"
  }
});
