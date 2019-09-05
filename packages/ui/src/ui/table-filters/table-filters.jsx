import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get } from 'lodash';

import { IconText } from '../icon-text';
import css from './table-filters.module.css';

const Checkbox = ({
  label, name, getOnOnlyClick, ...inputProps
}) => {
  const id = `filter-${name}`;

  return (
    <div className={css.filter}>
      {/* eslint-disable */}
      <label className={css.filterLabel}>
      {/* eslint-enabled */}
        <input
          className={css.filterInput}
          type="checkbox"
          id={id}
          name={name}
          {...inputProps}
        />
        <span className={css.filterText}>
          {label}
        </span>
      </label>
      {getOnOnlyClick && (
        <button
          className={css.filterOnlyButton}
          type="button"
          onClick={getOnOnlyClick(name)}
        >
          only
        </button>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  getOnOnlyClick: PropTypes.func,
};

Checkbox.defaultProps = {
  getOnOnlyClick: null,
};

const renderTree = (key, data, values, onCheckboxChange, getOnOnlyClick) => {
  if (typeof data.defaultValue !== 'undefined') {
    return (
      <Checkbox
        key={key}
        name={key}
        label={data.label}
        onChange={onCheckboxChange}
        checked={values[key]}
        disabled={data.disabled}
        getOnOnlyClick={getOnOnlyClick}
      />
    );
  }

  if (typeof data === 'object') {
    const { label: groupLabel, ...groupData } = data;
    const isRootGroup = !key;

    const groupItems = Object.entries(groupData);
    const groupCheckboxes = key && groupItems.filter(([itemKey, item]) => typeof item.defaultValue !== 'undefined') || [];
    const isGroupChecked = groupCheckboxes.map(([itemKey]) => get(values, `${key}.${itemKey}`)).reduce((agg, val) => agg && val, true);

    const onGroupClearAll = () => {
      groupCheckboxes.forEach(([itemKey, item]) => {
        onCheckboxChange({
          target: {
            name: `${key}.${itemKey}`,
            checked: false,
          },
        });
      });
    };

    const onGroupCheckAll = () => {
      groupCheckboxes.forEach(([itemKey, item]) => {
        onCheckboxChange({
          target: {
            name: `${key}.${itemKey}`,
            checked: true,
          },
        });
      });
    };

    const getOnGroupFilterOnlyClick = !isRootGroup && ((filterKey) => () => {
      onGroupClearAll();
      onCheckboxChange({
        target: {
          name: filterKey,
          checked: true,
        },
      });
    });

    return (
      <div className={css.group} key={key}>
        <div className={css.groupHeader}>
          {groupLabel && (
            <>
              <h3 className={css.groupTitle}>
                {groupLabel}
              </h3>
              {isGroupChecked ? (
                <button
                  className={css.groupHeaderButton}
                  type="button"
                  onClick={onGroupClearAll}
                >
                  clear all
                </button>
              ) : (
                <button
                  className={css.groupHeaderButton}
                  type="button"
                  onClick={onGroupCheckAll}
                >
                  check all
                </button>
              )}
            </>
          )}
        </div>

        {groupItems.map(([itemKey, itemData]) => renderTree(
          [...(key ? [key] : []), itemKey].join('.'),
          itemData,
          values,
          onCheckboxChange,
          getOnGroupFilterOnlyClick,
        ))}
      </div>
    );
  }

  return null;
};

export const TableFilters = (props) => {
  const {
    className,
    label,
    open,
    values,
    filters,
    toggleFilter,
    dropdownToggle,
  } = props;

  const onCheckboxChange = ({ target }) => toggleFilter(target.name, target.checked);
  const rootClassName = cx(css.root, className, open && css.open);

  return (
    <div className={rootClassName}>
      <IconText
        className={css.label}
        glyph="filter"
        as="button"
        type="button"
        onClick={dropdownToggle}
      >
        {label}
      </IconText>

      <form className={css.dropdown}>
        {renderTree('', filters, values, onCheckboxChange)}
      </form>
    </div>
  );
};

TableFilters.defaultProps = {
  className: '',
  label: 'Filters',
};

TableFilters.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  open: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  filters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  toggleFilter: PropTypes.func.isRequired,
  dropdownToggle: PropTypes.func.isRequired,
};
