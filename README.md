# SVG to Iconify Converter

This tool converts SVG icons to the Iconify JSON format.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Place your SVG icons in the `btp-svg-icons` directory.

3. Build the TypeScript code:
```bash
npm run build
```

4. Run the converter:
```bash
npm run convert
```

The converted icons will be saved in `json/btp-icons.json`. This file can be used with Iconify.

## Configuration

The converter is configured to:
- Use 'btp' as the icon set prefix
- Process all SVGs from the `btp-svg-icons` directory
- Output the result to `json/btp-icons.json`
- Set the icon height to 24px
- Convert all colors to `currentColor`

You can modify these settings in `src/convert-mdi.ts` if needed. 

Thanks to https://github.com/iconify/tools/tree/main/%40iconify/tools for the base code.