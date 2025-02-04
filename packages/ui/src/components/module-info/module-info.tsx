import React, { useMemo } from 'react';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import noop from 'lodash/noop';
import {
  BUNDLE_MODULES_DUPLICATE,
  FILE_TYPE_LABELS,
  MODULE_SOURCE_TYPE_LABELS,
  MetricRunInfo,
  getBundleModulesByChunk,
  getBundleModulesByFileTpe,
  getBundleModulesBySource,
} from '@bundle-stats/utils';
import { Module, MetaChunk } from '@bundle-stats/utils/types/webpack';

import { Tag } from '../../ui/tag';
import { ComponentLink } from '../component-link';
import { EntryInfo } from '../entry-info';
import css from './module-info.module.css';

interface ModuleInfoProps {
  item: {
    label: string;
    changed?: boolean;
    duplicated?: boolean;
    thirdParty?: boolean;
    fileType?: string;
    runs: Array<Module & MetricRunInfo>;
  };
  chunks?: Array<MetaChunk>;
  chunkIds?: Array<string>;
  labels: Array<string>;
  customComponentLink?: React.ElementType;
}

export const ModuleInfo = (props: ModuleInfoProps & React.ComponentProps<'div'>) => {
  const {
    className = '',
    item,
    labels,
    chunks = [],
    chunkIds = [],
    customComponentLink: CustomComponentLink = ComponentLink,
    onClick = noop,
  } = props;

  const rootClassName = cx(css.root, className);
  const currentRun = item.runs?.[0];

  const tags = useMemo(() => {
    if (!item.duplicated) {
      return null;
    }

    return (
      <div>
        <Tag as={CustomComponentLink} {...BUNDLE_MODULES_DUPLICATE} onClick={onClick} kind="danger">
          Duplicate
        </Tag>
      </div>
    );
  }, [item]);

  const fileTypeLabel = FILE_TYPE_LABELS[item.fileType as keyof typeof FILE_TYPE_LABELS];

  const sourceTypeLabel = item.thirdParty
    ? MODULE_SOURCE_TYPE_LABELS.THIRD_PARTY
    : MODULE_SOURCE_TYPE_LABELS.FIRST_PARTY;

  return (
    <EntryInfo item={item} labels={labels} tags={tags} className={rootClassName}>
      {!isEmpty(currentRun?.chunkIds) && (
        <div className={css.chunks}>
          <span className={css.label}>Chunks</span>
          {currentRun.chunkIds.map((chunkId) => {
            const chunk = chunks?.find(({ id }) => id === chunkId);

            if (!chunk) {
              return null;
            }

            return (
              <Tag
                as={CustomComponentLink}
                {...getBundleModulesByChunk(chunkIds, chunkId)}
                onClick={onClick}
                className={css.chunksItem}
              >
                {chunk.name}
              </Tag>
            );
          })}
        </div>
      )}

      {item?.fileType && (
        <p>
          <span className={css.label}>File type</span>
          <Tag
            as={CustomComponentLink}
            {...getBundleModulesByFileTpe(item.fileType, fileTypeLabel)}
            onClick={onClick}
          >
            {fileTypeLabel}
          </Tag>
        </p>
      )}

      <p>
        <span className={css.label}>Source</span>
        <Tag
          as={CustomComponentLink}
          {...getBundleModulesBySource(item.thirdParty || false, sourceTypeLabel)}
          onClick={onClick}
        >
          {sourceTypeLabel}
        </Tag>
      </p>
    </EntryInfo>
  );
};
