import type { CSSProperties } from 'react';
import { isRealImage, getEventImageUrl } from '../../mock-data/media';
import { placeholderStyle } from '../ImagePicker/ImagePicker';
import styles from './ActivityImage.module.css';

interface ActivityImageProps {
  imageId: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}

// Renders a real event photo (a Media entry with kind 'image' + url) or a gradient
// placeholder tile (imageId "placeholder-N", used by mock/user-created activities)
// with the same box — callers don't need to know which kind of image they have.
export function ActivityImage({ imageId, alt, className = '', style }: ActivityImageProps) {
  if (isRealImage(imageId)) {
    return (
      <img
        src={getEventImageUrl(imageId)}
        alt={alt}
        className={`${styles.photo} ${className}`}
        style={style}
      />
    );
  }
  return <div className={`${styles.placeholder} ${className}`} style={{ ...placeholderStyle(imageId), ...style }} />;
}
