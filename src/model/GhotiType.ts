import { TaggedUnionMeta } from './TaggedUnion';
import { ArrayOfMeta } from './ArrayOf';
import { ReferenceMeta } from './Reference';
import { PrimitiveMeta } from './Primitive';
import { EnumOfMeta } from './EnumOf';

export type GhotiType = TaggedUnionMeta | ArrayOfMeta | ReferenceMeta | PrimitiveMeta | EnumOfMeta