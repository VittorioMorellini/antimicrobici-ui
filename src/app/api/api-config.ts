import { untail, behead } from '../commons/commons';

export class ApiConfig {
  rootPath: string;
}

export function mkUrl(apiConfig: ApiConfig, path: string): string {
  const rootUrl = untail(apiConfig.rootPath, '/');
  const relUrl = behead(path, '/');
  return rootUrl + '/' + relUrl;
}
