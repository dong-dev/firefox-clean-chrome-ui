#!/usr/bin/env node

import { homedir } from "node:os";
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { cp, mkdir, readdir } from "node:fs/promises";
import { group, groupEnd, info } from "node:console";

const ignoreFolders = [
    'Crash Reports',
    'Pending Pings',
    'Profile Groups',
]
const FIREFOX_DATA_DIRECTORY = resolve(homedir(), '.mozilla', 'firefox');

const dirents = await readdir(FIREFOX_DATA_DIRECTORY, { withFileTypes: true });

const profileFolders = dirents
    .filter(dirent => dirent.isDirectory() && !ignoreFolders.includes(dirent.name));

for (const { parentPath, name: profileName } of profileFolders) {
    const profilePath = resolve(parentPath, profileName);
    const chromeFolder = resolve(profilePath, 'chrome');
    const userChromeFilePath = resolve(chromeFolder, 'userChrome.css');
    const userContentFilePath = resolve(chromeFolder, 'userContent.css');

    info('Profile:', profileName);
    info('Path:', profilePath);
    group('Copy styles');
    if (!existsSync(chromeFolder)) {
        info('Creating chrome folder');
        await mkdir(chromeFolder);
    }

    if (existsSync(userChromeFilePath)) {
        info('Override userChrome.css');
    }
    await cp('./userChrome.css', userChromeFilePath);

    if (existsSync(userContentFilePath)) {
        info('Override userContent.css');
    }
    await cp('./userContent.css', userContentFilePath);
    groupEnd();
    info();
}

