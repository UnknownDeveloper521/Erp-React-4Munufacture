# Logo Setup Guide

This guide will help you add your company logo to the Tassos ERP System.

## Quick Setup

### 1. Prepare Your Logo
- **Format**: PNG with transparent background (recommended)
- **Size**: 200x60px or similar aspect ratio
- **File name**: `logo.png`

### 2. Add Logo to Project
1. Place your logo file in: `public/assets/images/logos/logo.png`
2. The system will automatically use your logo in the sidebar

### 3. Optional: Add Additional Logo Variants
- `logo-white.png` - White version for dark backgrounds
- `logo-small.png` - Small version (32x32px or 64x64px)
- `favicon.ico` - Browser favicon (place in `public/` folder)

## Current Implementation

The logo is currently used in:
- **Sidebar header** - Main company logo
- **Fallback**: If logo file doesn't exist, shows "Tassos ERP" text

## File Structure
```
public/
├── assets/
│   └── images/
│       └── logos/
│           ├── logo.png          # Main logo (add this)
│           ├── logo-white.png    # Optional: white version
│           ├── logo-small.png    # Optional: small version
│           └── favicon.ico       # Optional: browser icon
└── favicon.ico                   # Default favicon location
```

## Customization

### Change Logo Size
Edit `src/components/Sidebar.js` and modify the className:
```jsx
<img 
  src="/assets/images/logos/logo.png" 
  alt="Company Logo" 
  className="h-8 w-auto mr-3"  // Change h-8 to your desired height
/>
```

### Add Logo to Other Components
You can use the logo in other components:
```jsx
<img 
  src="/assets/images/logos/logo.png" 
  alt="Company Logo" 
  className="h-12 w-auto"
/>
```

### Add Favicon
1. Create a favicon.ico file (16x16px, 32x32px)
2. Place it in the `public/` folder
3. Update `public/index.html` if needed:
```html
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
```

## Testing

After adding your logo:
1. Start the development server: `npm start`
2. Check the sidebar - your logo should appear
3. If logo doesn't load, check:
   - File path is correct: `public/assets/images/logos/logo.png`
   - File format is supported (PNG, JPG, SVG)
   - File size is reasonable (< 1MB recommended)

## Troubleshooting

### Logo Not Showing
- **Check file path**: Must be exactly `public/assets/images/logos/logo.png`
- **Check file format**: PNG, JPG, or SVG
- **Check browser console**: Look for 404 errors
- **Clear browser cache**: Hard refresh (Ctrl+F5)

### Logo Too Large/Small
- **Resize image file**: Use image editing software
- **Adjust CSS**: Change `h-8` to `h-6`, `h-10`, etc. in Sidebar.js

### Logo Quality Issues
- **Use PNG**: For logos with transparency
- **Use SVG**: For scalable vector graphics
- **Optimize file size**: Compress images before adding

## Need Help?

If you need help with logo setup:
1. Check the browser console for errors
2. Verify file paths and names
3. Test with a simple PNG file first
4. Refer to the assets README: `public/assets/README.md`

Your logo will make the ERP system truly yours! 🎨
