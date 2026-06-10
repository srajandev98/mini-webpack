export interface MiniWebpackUserConfig {
  root?: string;
  entry: string;
  output?: {
    path?: string;
    filename?: string;
  };
}

export interface MiniWebpackConfig {
  root: string;
  entry: string;
  output: {
    path: string;
    filename: string;
  };
}
