import { Pressable } from 'react-native';
import { useSx } from 'dripsy';

export const StyledPressable = ({ sx, style, ...props }) => {
  const resolveSx = useSx();
  const combinedStyle = [resolveSx(sx), style];

  return <Pressable {...props} style={combinedStyle} />;
};
