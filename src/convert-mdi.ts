import { promises as fs } from 'fs';
import { dirname, join } from 'path';

import {
    importDirectory,
    cleanupSVG,
    parseColors,
    isEmptyColor,
    runSVGO,
    cleanupIconKeyword,
} from '@iconify/tools';
import type { IconifyInfo } from '@iconify/types';

// File to save icon set to
const target = 'json/btp-icons.json';

// SVG files location
const sourceSVGDir = join(__dirname, '..', 'btp-svg-icons');

// Prefix to use for icon set
const prefix = 'btp';

// Expected icon size (you might want to adjust this based on your SVGs)
const expectedSize = 24;

// Icon set information
const info: IconifyInfo = {
    name: 'BTP SVG Icons',
    author: {
        name: 'BTP',
    },
    license: {
        title: 'MIT',
    },
    height: expectedSize,
    samples: [], // Will be filled with some icon names after import
};

// Import icons
(async function () {
    // Import icons
    const iconSet = await importDirectory(sourceSVGDir, {
        prefix,
    });

    // Set info
    iconSet.info = info;

    // Update samples with first 3 icons
    const iconNames = Object.keys(iconSet.entries);
    info.samples = iconNames.slice(0, 3);

    // Validate, clean up, fix palette and optimise
    await iconSet.forEach(async (name: string, type: string) => {
        if (type !== 'icon') {
            return;
        }

        // Get SVG instance for parsing
        const svg = iconSet.toSVG(name);
        if (!svg) {
            // Invalid icon
            iconSet.remove(name);
            return;
        }

        // Clean up and optimise icons
        try {
            // Clean up icon code
            cleanupSVG(svg);

            // Replace color with currentColor, add if missing
            parseColors(svg, {
                defaultColor: 'currentColor',
                callback: (attr: string, colorStr: string, color: any) => {
                    return !color || isEmptyColor(color) ? colorStr : 'currentColor';
                },
            });

            // Optimise
            runSVGO(svg);
        } catch (err) {
            // Invalid icon
            console.error(`Error parsing ${name}:`, err);
            iconSet.remove(name);
            return;
        }

        // Update icon from SVG instance
        iconSet.fromSVG(name, svg);
    });
    console.log(`Imported ${iconSet.count()} icons`);

    // Export to IconifyJSON, convert to string
    const output = JSON.stringify(iconSet.export(), null, '\t');

    // Create directory for output if missing
    const dir = dirname(target);
    try {
        await fs.mkdir(dir, {
            recursive: true,
        });
    } catch (err) {
        //
    }

    // Save to file
    await fs.writeFile(target, output, 'utf8');

    console.log(`Saved ${target} (${output.length} bytes)`);
})().catch((err) => {
    console.error(err);
}); 