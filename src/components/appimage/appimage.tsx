export interface AppImageProps {
  width: string;
  height: string;
  iconPath: string;
  alt?: string;
}
const AppImage: React.FC<AppImageProps> = ({
  width,
  height,
  iconPath,
  alt,
}) => (
  <img
    src={iconPath}
    alt={alt}
    style={{
      width: width,
      height: height,
      flexShrink: 0,
      objectFit: "contain",
      minHeight: height,
      minWidth: width,
    }}
  />
);
export default AppImage;
