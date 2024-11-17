export function replaceNewLine(input: string): string {
  const newLines: string[] = [];
  const lines = input.split("\n").map((line) => `${line}\n`);
  let inCode = false;

  for (let i = 0; i + 1 < lines.length; i++) {
    let curr = lines[i];
    let next = lines[i + 1];

    if (curr.match(/^(```|---)/)) {
      // コードの開始・終了行はそのまま出力
      inCode = !inCode;
      newLines.push(curr);
      continue;
    }
    if (curr.trim().length === 0) {
      // 空行はそのまま
    } else if (next.trim().length === 0) {
      // 次の行が空行の時はそのまま
    } else if (/^```/.test(next)) {
      // 次の行が空行の時はそのまま
    } else {
      if (inCode) {
        // コード内部はそのまま
      } else {
        if (!/^(#+|-|\*|\d+\.) /.test(curr.trim())) {
          if (!/^(#+|-|\*|\d+\.) /.test(next.trim())) {
            curr = curr.slice(0, -1) + " ";
          }
        } else if (/^(-|\*|\d+\.) /.test(curr.trim())) {
          if (!/^(-|\*|\d+\.) /.test(next.trim())) {
            curr += "\n";
          }
        }
      }
    }
    newLines.push(curr);

    // 最後の行は無条件にそのまま入れる
    if (i + 1 === lines.length - 1) newLines.push(next.slice(0, -1));
  }
  return newLines.join("");
}
