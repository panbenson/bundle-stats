import React, { useCallback, useMemo } from 'react';
import { getGlobalMetricType, getMetricRunInfo } from '@bundle-stats/utils';

import { Stack } from '../../layout/stack';
import { RunInfo, RunInfoProps } from '../run-info';
import css from './metric-run-info.module.css';

interface MetricInfoProps {
  description: string;
  url?: string;
}

const MetricHoverCard = ({ description, url }: MetricInfoProps) => {
  // The component parent can be rendered inside a link, use button to avoid using nested links
  const onClick = useCallback(() => {
    if (url) {
      window.open(url);
    }
  }, [url]);

  return (
    <Stack space="xxxsmall">
      <p>{description}</p>
      {url && (
        <p>
          <button type="button" onClick={onClick} className={css.readMoreLink}>
            Read more
          </button>
        </p>
      )}
    </Stack>
  );
};

export interface MetricRunInfoProps {
  metricId: string;
  current: number;
  baseline?: number;
  showDelta?: boolean;
  showMetricDescription?: boolean;
  size?: RunInfoProps['size'];
  loading?: RunInfoProps['loading'];
}

export const MetricRunInfo = (props: MetricRunInfoProps & React.ComponentProps<'div'>) => {
  const {
    metricId,
    current,
    baseline = undefined,
    showDelta = true,
    showMetricDescription = true,
    ...restProps
  } = props;

  const metric = getGlobalMetricType(metricId);
  const metricRunInfo = getMetricRunInfo(metric, current, baseline || 0);
  const showBaseline = typeof baseline !== 'undefined';

  const titleHoverCard = useMemo(() => {
    if (showMetricDescription) {
      return <MetricHoverCard description={metric.description} url={metric.url} />;
    }

    return null;
  }, [showMetricDescription, metric]);

  return (
    <RunInfo
      title={metric.label}
      titleHoverCard={titleHoverCard}
      current={metricRunInfo.displayValue}
      {...(showBaseline && {
        baseline: metric.formatter(baseline),
      })}
      {...(showDelta && showBaseline && {
        delta: metricRunInfo.displayDeltaPercentage,
        deltaType: metricRunInfo.deltaType,
      })}
      {...restProps}
    />
  );
};
