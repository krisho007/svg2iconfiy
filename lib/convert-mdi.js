"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const tools_1 = require("@iconify/tools");
// File to save icon set to
const target = 'json/btp-icons.json';
// SVG files location
const sourceSVGDir = (0, path_1.join)(__dirname, '..', 'btp-svg-icons');
// Prefix to use for icon set
const prefix = 'btp';
// Expected icon size (you might want to adjust this based on your SVGs)
const expectedSize = 24;
// Icon set information
const info = {
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
    const iconSet = await (0, tools_1.importDirectory)(sourceSVGDir, {
        prefix,
    });
    // Set info
    iconSet.info = info;
    // Update samples with first 3 icons
    const iconNames = Object.keys(iconSet.entries);
    info.samples = iconNames.slice(0, 3);
    // Validate, clean up, fix palette and optimise
    await iconSet.forEach(async (name, type) => {
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
            (0, tools_1.cleanupSVG)(svg);
            // Replace color with currentColor, add if missing
            (0, tools_1.parseColors)(svg, {
                defaultColor: 'currentColor',
                callback: (attr, colorStr, color) => {
                    return !color || (0, tools_1.isEmptyColor)(color) ? colorStr : 'currentColor';
                },
            });
            // Optimise
            (0, tools_1.runSVGO)(svg);
        }
        catch (err) {
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
    const dir = (0, path_1.dirname)(target);
    try {
        await fs_1.promises.mkdir(dir, {
            recursive: true,
        });
    }
    catch (err) {
        //
    }
    // Save to file
    await fs_1.promises.writeFile(target, output, 'utf8');
    console.log(`Saved ${target} (${output.length} bytes)`);
})().catch((err) => {
    console.error(err);
});
