import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenViewProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  className?: string;
  excludeTop?: boolean;
  excludeBottom?: boolean;
  excludeLeft?: boolean;
  excludeRight?: boolean;
  [key: string]: any;
}

export default function ScreenView({
  children,
  style,
  className,
  excludeTop = false,
  excludeBottom = false,
  excludeLeft = false,
  excludeRight = false,
  ...props
}: ScreenViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          paddingTop: excludeTop ? 0 : insets.top,
          paddingLeft: excludeLeft ? 0 : insets.left,
          paddingBottom: excludeBottom ? 0 : insets.bottom,
          paddingRight: excludeRight ? 0 : insets.right,
        },
        style,
      ]}
      className={className}
      {...props}
    >
      {children}
    </View>
  );
}
