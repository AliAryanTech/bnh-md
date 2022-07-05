import axios from 'axios'
import { tmpdir } from 'os'
import { promisify } from 'util'
import { exec } from 'child_process'
import { readFile, unlink, writeFile } from 'fs-extra'
import regex from 'emoji-regex'


export class Utils {
    public generateRandomHex = (): string => `#${(~~(Math.random() * (1 << 24))).toString(16)}`

    public capitalize = (content: string): string => `${content.charAt(0).toUpperCase()}${content.slice(1)}`

    public generateRandomUniqueTag = (n: number = 4): string => {
        let max = 11
        if (n > max) return `${this.generateRandomUniqueTag(max)}${this.generateRandomUniqueTag(n - max)}`
        max = Math.pow(10, n + 1)
        const min = max / 10
        return (Math.floor(Math.random() * (max - min + 1)) + min).toString().substring(1)
    }}