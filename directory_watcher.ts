import * as fs from "fs";
import * as path from "path";

interface FileState {
  [filename: string]: string; // ファイル名をキーに、最終更新日時を値として持つ
}

interface State {
  last_check_time: string;
  file_states: FileState;
}

class FileChangeDetector {
  private stateFile: string;
  private directory: string;
  private state: State;

  constructor(directory: string, stateFile: string) {
    this.directory = directory;
    this.stateFile = stateFile;
    this.state = this.loadState();
  }

  private loadState(): State {
    try {
      const data = fs.readFileSync(this.stateFile, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // ファイルが存在しない場合や読み込みエラーの場合は新しい状態を作成
      return { last_check_time: new Date().toISOString(), file_states: {} };
    }
  }

  private saveState(): void {
    fs.writeFileSync(this.stateFile, JSON.stringify(this.state), "utf8");
  }

  public checkForChanges(): string[] {
    const changedFiles: string[] = [];
    const currentTime = new Date().toISOString();

    fs.readdirSync(this.directory).forEach((file) => {
      const filePath = path.join(this.directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        const lastModified = stats.mtime.toISOString();
        if (
          !this.state.file_states[file] ||
          lastModified > this.state.file_states[file]
        ) {
          changedFiles.push(file);
          this.state.file_states[file] = lastModified;
        }
      }
    });

    this.state.last_check_time = currentTime;
    this.saveState();

    return changedFiles;
  }
}

export function replaceNewLine(input: string): string {
  const newLines: string[] = [];
  const lines = input.split("\n").map((line) => `${line}\n`);
  let inCode = false;

  for (let i = 0; i + 1 < lines.length; i++) {
    let curr = lines[i];
    let next = lines[i + 1];

    if (curr.trim().length === 0) {
      // 空行はそのまま
    } else if (next.trim().length === 0) {
      // 次の行が空行の時はそのまま
    } else if (curr.match(/^```/)) {
      // コードの開始・終了行はそのまま出力
      inCode = !inCode;
    } else {
      if (inCode) {
        // コード内部はそのまま
      } else {
        if (!/^(#+|-|\*|\d+\.) /.test(curr.trim())) {
          if (!/^(#+|-|\*|\d+\.) /.test(next.trim())) {
            curr = curr.slice(0, -1) + " ";
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

function replaceAndSave(inputPath: string, outputPath: string): void {
  try {
    // 入力ファイルの内容を読み込む
    let s = fs.readFileSync(inputPath, "utf-8");

    // 正規表現で内容を置換
    s = replaceNewLine(s);

    // 新しい内容を出力ファイルに書き込む
    fs.writeFileSync(outputPath, s, "utf-8");

    console.log(`File successfully processed and saved to ${outputPath}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// 使用例
const detector = new FileChangeDetector("./my_directory", "./file_state.json");
const changedFiles = detector.checkForChanges();
for (const file of changedFiles) {
  replaceAndSave(path.join("./my_directory", file), path.join("./out", file));
}
console.log("Changed files:", changedFiles);
