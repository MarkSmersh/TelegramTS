export function Escape (text: string) {
    return (text.replace(/(\_|\*|\[|\]|\(|\)|\~|\`|\>|\#|\+|\-|\=|\||\{|\}|\.|\.|\\)/g, "\\$1"));
}