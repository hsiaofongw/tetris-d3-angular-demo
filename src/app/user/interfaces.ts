import { QueryResult } from '../types/request';

export type UserProfileQueryResult = QueryResult<{ username: string, avatarUrl: string }>;
