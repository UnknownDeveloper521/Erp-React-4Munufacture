# Assets Directory

This directory contains all static assets used in the Tassos ERP System.

## Directory Structure

```
public/assets/
├── images/
│   ├── logos/          # Company logos and branding
│   ├── icons/          # Custom icons and graphics
│   ├── avatars/        # Default user avatars
│   └── backgrounds/    # Background images
└── README.md          # This file
```

## Usage Guidelines

### Logos (`/images/logos/`)
Place your company logos here. Recommended files:
- `logo.png` - Main company logo (transparent background)
- `logo-white.png` - White version for dark backgrounds
- `logo-small.png` - Small version for sidebar/navbar (32x32 or 64x64)
- `favicon.ico` - Browser favicon

**Recommended formats:** PNG, SVG
**Recommended sizes:** 
- Main logo: 200x60px or similar aspect ratio
- Small logo: 32x32px, 64x64px
- Favicon: 16x16px, 32x32px

### Icons (`/images/icons/`)
Custom icons and graphics used throughout the application.
- Module icons
- Status indicators
- Custom UI elements

**Recommended formats:** PNG, SVG
**Recommended sizes:** 16x16px, 24x24px, 32x32px, 48x48px

### Avatars (`/images/avatars/`)
Default user avatar images and placeholders.
- `default-avatar.png` - Default user avatar
- `admin-avatar.png` - Default admin avatar
- `team-avatars/` - Team member photos

**Recommended formats:** PNG, JPG
**Recommended sizes:** 64x64px, 128x128px, 256x256px

### Backgrounds (`/images/backgrounds/`)
Background images for various sections.
- Login page backgrounds
- Dashboard backgrounds
- Module-specific backgrounds

**Recommended formats:** JPG, PNG, WebP
**Recommended sizes:** 1920x1080px or higher for full-screen backgrounds

## How to Use Assets in Code

### In React Components:
```jsx
// Using public folder assets
<img src="/assets/images/logos/logo.png" alt="Company Logo" />

// Using process.env.PUBLIC_URL for better compatibility
<img src={`${process.env.PUBLIC_URL}/assets/images/logos/logo.png`} alt="Company Logo" />
```

### In CSS:
```css
.logo {
  background-image: url('/assets/images/logos/logo.png');
}
```

## File Naming Conventions

- Use lowercase letters
- Use hyphens (-) instead of spaces or underscores
- Be descriptive but concise
- Include size in filename if multiple sizes exist

Examples:
- `company-logo.png`
- `user-avatar-64x64.png`
- `dashboard-background.jpg`
- `success-icon.svg`

## Optimization Tips

1. **Compress images** before adding them to reduce bundle size
2. **Use appropriate formats:**
   - PNG for logos and icons with transparency
   - JPG for photos and complex images
   - SVG for simple graphics and icons
   - WebP for modern browsers (with fallbacks)
3. **Provide multiple sizes** for responsive design
4. **Use lazy loading** for large images

## Current Assets

Currently, this directory is empty. Add your company assets here following the guidelines above.

### Quick Start:
1. Add your company logo as `logos/logo.png`
2. Update the Sidebar component to use your logo
3. Add a favicon.ico to the public folder root
4. Customize the default avatars and icons as needed

## Need Help?

If you need help with image optimization or have questions about asset management, refer to the project documentation or create an issue in the repository.
