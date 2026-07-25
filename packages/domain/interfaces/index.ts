export interface Engine {
  name: string;
  run(input: unknown): Promise<unknown>;
}

export interface Plugin {
  name: string;
  version?: string;
  enable?(): void;
}

export interface Analyzer {
  analyze(input: unknown): Promise<unknown>;
}

export interface RuleContract {
  id: string;
  name: string;
  evaluate(input: unknown): Promise<boolean>;
}

export interface Reporter {
  report(input: unknown): Promise<unknown>;
}

export interface Scanner {
  scan(target: string): Promise<unknown>;
}

export interface PipelineStage {
  execute(input: unknown): Promise<unknown>;
}
