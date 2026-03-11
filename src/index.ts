// ── Core ────────────────────────────────────────────────────────────────────
export { Auxta } from './core/Auxta';
export { AuxtaVector } from './core/AuxtaVector';
export { AuxtaDimension } from './core/AuxtaDimension';
export { AuxtaIndex } from './core/AuxtaIndex';
export { AuxtaStaticDimension } from './core/dimensions/AuxtaStaticDimension.class';
export { AuxtaDynamicDimension } from './core/dimensions/AuxtaDynamicDimension.class';
export { AuxtaComputedDimension } from './core/dimensions/AuxtaComputedDimension.class';

// ── Commands ─────────────────────────────────────────────────────────────────
export { AuxtaCommand } from './lib/AuxtaCommand.class';
export { AuxtaBaseCommand } from './lib/AuxtaBaseCommand.class';
export { AuxtaConditionBuilder } from './lib/AuxtaConditionBuilder.class';
export { AuxtaAddCommand } from './lib/commands/AuxtaAdd.command';
export { AuxtaGetCommand } from './lib/commands/AuxtaGet.command';
export { AuxtaSearchCommand } from './lib/commands/AuxtaSearch.command';
export { AuxtaDefineCommand } from './lib/commands/AuxtaDefine.command';
export { AuxtaDropCommand } from './lib/commands/AuxtaDrop.command';

// ── Decorators ───────────────────────────────────────────────────────────────
export { Index, AUXTA_INDEX_METADATA_KEY, AUXTA_INDEXES, AUXTA_VECTORS } from './decorators/Index.decorator';
export { Static, Dynamic, Computed, Aggregated, Latest, registerDimension } from './decorators/Dimension.decorator';

// ── Errors ───────────────────────────────────────────────────────────────────
export { AuxtaError } from './errors/AuxtaError.class';
export { AuxtaDimensionError } from './errors/AuxtaDimension.error';
export { AuxtaVectorError } from './errors/AuxtaVector.error';
export { AuxtaIndexError } from './errors/AuxtaIndex.error';
export { AuxtaCommandError } from './errors/AuxtaCommand.error';

// ── Types ────────────────────────────────────────────────────────────────────
export type { IAuxtaConstructorConfig } from './types/Auxta.types';
export type { AuxtaVectorConstructorProps, AuxtaVectorDefinition, AuxtaSerializedVector } from './types/AuxtaVector.types';
export type {
    IDimension,
    DimensionConstructorBaseConfig,
    AuxtaDimensionConfig,
    AuxtaDimensionDefinition,
    AuxtaBaseDimensionDefinition,
    AuxtaStaticDimensionDefinition,
    AuxtaDynamicDimensionDefinition,
    AuxtaComputedDimensionDefinition,
    StaticDimensionConstructorConfig,
    DynamicDimensionConstructorConfig,
    DynamicDimensionConstructorBaseConfig,
    DynamicDimensionAggregatedConstructorConfig,
    DynamicDimensionLatestConstructorConfig,
    ComputedDimensionConstructorConfig,
} from './types/AuxtaDimension.types';
export type { IAuxtaIndexConstructorConfig, AuxtaIndexDefinition } from './types/AuxtaIndex.types';
export type {
    AuxtaRawCommand,
    AuxtaRawCommandResponse,
    AuxtaBaseRawCommand,
    AuxtaCommandBaseResponse,
    AuxtaAddRawCommand,
    AuxtaAddResponse,
    AuxtaGetRawCommand,
    AuxtaSearchRawCommand,
    AuxtaSearchResponse,
    AuxtaDefineRawCommand,
    AuxtaDefineResponse,
    AuxtaDropRawCommand,
    AuxtaDropResponse,
    AuxtaCondition,
    AuxtaConditionWrapper,
    AuxtaLogicalGroup,
    AuxtaLogicalOperator,
    AuxtaOperatorType,
    AuxtaDbOperations,
    AuxtaDBEntity,
} from './types/AuxtaCommand.types';
export type { AuxtaServerRequest, AuxtaServerResponse } from './types/AuxtaClient.types';

// ── Constants ────────────────────────────────────────────────────────────────
export { GLOBAL_CONSTANTS } from './constants/Global.constants';
export {
    AuxtaDimensionTypeSizeMap,
    AuxtaDimensionErrorCode,
} from './constants/AuxtaDimension.constants';
export type {
    AuxtaDimensionValueType,
    AuxtaDimensionScope,
    AuxtaDynamicDimensionAggregatedTypes,
    AuxtaDynamicDimensionBehaviors,
    DimensionBaseTypes,
} from './constants/AuxtaDimension.constants';
export { AuxtaIndexErrorCodes } from './constants/AuxtaIndex.constants';
export type { AuxtaIndexMode } from './constants/AuxtaIndex.constants';
export { AuxtaVectorErrorCodes } from './constants/AuxtaVector.constants';
export { AuxtaCommandErrorCodes } from './constants/AuxtaCommand.constants';
export { AuxtaErrorCodes } from './constants/Auxta.constants';
export { AUXTA_CLIENT_HEADER_SIZES, AuxtaServerAction } from './constants/AuxtaClient.constants';

// ── Metadata ─────────────────────────────────────────────────────────────────
export { AUXTA_DIMENSION_INDEX_METADATA_KEY, AUXTA_DIMENSION_VECTOR_METADATA_KEY, AUXTA_VECTOR_METADATA_KEY } from './metadata/Dimensions.meta';

// ── Utils ────────────────────────────────────────────────────────────────────
export { EnvUtil } from './utils/Env.util';
export { AuxtaLogger } from './utils/Logger.service';
