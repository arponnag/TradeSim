// Background system based on net worth levels
export const BACKGROUND_LEVELS = [
  {
    min: 0,
    max: 50000,
    name: 'starter',
    description: 'Starting out - small apartment vibes'
  },
  {
    min: 50000,
    max: 200000,
    name: 'growing',
    description: 'Growing wealth - better apartment'
  },
  {
    min: 200000,
    max: 500000,
    name: 'comfortable',
    description: 'Comfortable - nice house'
  },
  {
    min: 500000,
    max: 1000000,
    name: 'wealthy',
    description: 'Wealthy - luxury home'
  },
  {
    min: 1000000,
    max: Infinity,
    name: 'millionaire',
    description: 'Millionaire - mansion lifestyle'
  }
];

export function getBackgroundLevel(netWorth) {
  return BACKGROUND_LEVELS.find(level => netWorth >= level.min && netWorth < level.max) || BACKGROUND_LEVELS[0];
}

export function getBackgroundImage(netWorth) {
  const level = getBackgroundLevel(netWorth);
  // Try different image formats (jpg, png, svg)
  const imageFormats = ['jpg', 'png', 'jpeg', 'svg', 'webp'];
  
  // Return the first format that exists, or default to svg
  // In production, you'd check if file exists, but for now we'll use a naming convention
  return `/backgrounds/${level.name}.jpg`; // Try jpg first, fallback handled in CSS
}

export function getBackgroundStyle(netWorth = 0) {
  const level = getBackgroundLevel(netWorth);
  
  // Map wallpaper files to levels - using the actual files you added
  // URL encode spaces in filenames
  const wallpaperFiles = {
    starter: '/backgrounds/Wallpapers/Level%201%20Room.jpg',
    growing: '/backgrounds/Wallpapers/Level%202%20cafe%20Ghilbi.jpg',
    comfortable: '/backgrounds/Wallpapers/Level%203%20Office.jpg',
    wealthy: '/backgrounds/Wallpapers/Level%204%20Personal%20Refined%20Office.jpg',
    millionaire: '/backgrounds/Wallpapers/Level%205.jpg'
  };
  
  // Also try without encoding (some servers handle it automatically)
  const wallpaperFilesRaw = {
    starter: '/backgrounds/Wallpapers/Level 1 Room.jpg',
    growing: '/backgrounds/Wallpapers/Level 2 cafe Ghilbi.jpg',
    comfortable: '/backgrounds/Wallpapers/Level 3 Office.jpg',
    wealthy: '/backgrounds/Wallpapers/Level 4 Personal Refined Office.jpg',
    millionaire: '/backgrounds/Wallpapers/Level 5.jpg'
  };
  
  // Try encoded first, fallback to raw
  const imagePath = wallpaperFiles[level.name] || wallpaperFiles.starter;
  const imagePathRaw = wallpaperFilesRaw[level.name] || wallpaperFilesRaw.starter;
  
  // Use both encoded and raw in case one works
  const backgroundImage = `url("${imagePathRaw}"), url(${imagePath})`;
  
  // Lighthearted gradient backgrounds as fallback if images don't load
  const gradients = {
    starter: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e8ba3 100%)',
    growing: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #a78bfa 100%)',
    comfortable: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
    wealthy: 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #30cfd0 100%)',
    millionaire: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 50%, #ff1493 100%)'
  };
  
  // Overlay opacity - lighter for better wallpaper visibility
  const overlays = {
    starter: 'rgba(0, 0, 0, 0.25)',
    growing: 'rgba(0, 0, 0, 0.2)',
    comfortable: 'rgba(0, 0, 0, 0.15)',
    wealthy: 'rgba(0, 0, 0, 0.1)',
    millionaire: 'rgba(0, 0, 0, 0.05)'
  };
  
  // Only log in development to reduce console spam
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.01) {
    console.log(`Background Level: ${level.name}, Net Worth: $${netWorth.toLocaleString()}, Image: ${imagePathRaw}`);
  }
  
  return {
    backgroundImage: backgroundImage,
    gradient: gradients[level.name] || gradients.starter,
    overlay: overlays[level.name] || overlays.starter,
    levelName: level.name,
    imagePath: imagePathRaw // For debugging
  };
}

