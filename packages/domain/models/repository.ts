export interface Repository {
  id: string;
  name: string;
  path: string;
  projects: Project[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  path: string;
  repositoryId: string;
  files: SourceFile[];
}

export interface SourceFile {
  id: string;
  path: string;
  language: string;
  content?: string;
  modules?: Module[];
}

export interface Module {
  id: string;
  name: string;
  path?: string;
  files: string[];
}

export interface Component {
  id: string;
  name: string;
  fileId: string;
  kind: 'component' | 'container' | 'presentational';
}

export interface Hook {
  id: string;
  name: string;
  fileId: string;
}

export interface FunctionModel {
  id: string;
  name: string;
  fileId: string;
  signature?: string;
}

export interface VariableModel {
  id: string;
  name: string;
  fileId: string;
  value?: string;
}

export interface Dependency {
  id: string;
  sourceFileId: string;
  targetFileId: string;
  kind: string;
}

export interface ImportModel {
  id: string;
  sourceFileId: string;
  importedFrom: string;
  importedName?: string;
}

export interface ExportModel {
  id: string;
  sourceFileId: string;
  exportedName: string;
}

export interface ASTNodeReference {
  id: string;
  nodeType: string;
  fileId: string;
  line?: number;
}
