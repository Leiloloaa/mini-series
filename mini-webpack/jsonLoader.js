export function jsonLoader(source) {
    return `export default ${JSON.stringify(source)}`
}