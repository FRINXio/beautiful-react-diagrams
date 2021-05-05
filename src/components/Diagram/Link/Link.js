import React, { useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { LinkType, NodeType, PortType } from '../../../shared/Types';
import usePortRefs from '../../../shared/internal_hooks/usePortRefs';
import useCanvas from '../../../shared/internal_hooks/useCanvas';
import getCoords from './getEntityCoordinates';
import makeSvgPath from '../../../shared/functions/makeSvgPath';
import getPathMidpoint from '../../../shared/functions/getPathMidpoint';
import useNodeRefs from '../../../shared/internal_hooks/useNodeRefs';
import LinkLabel from './LinkLabel';

// local hook, returns portRefs & nodeRefs
const useContextRefs = () => {
  const { canvas, panVal, scaleVal } = useCanvas();
  const portRefs = usePortRefs();
  const nodeRefs = useNodeRefs();

  return { canvas, panVal, scaleVal, nodeRefs, portRefs };
};

const getLabelPosition = (path) => {
  if (!path) {
    return null;
  }
  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathElement.setAttribute('d', path);
  return getPathMidpoint(pathElement);
};

/**
 * A Diagram link component displays the link between two diagram nodes or two node ports.
 */
const Link = (props) => {
  const { input, output, link, onDelete } = props;
  const pathRef = useRef();
  const { portRefs, nodeRefs } = useContextRefs();
  // eslint-disable-next-line max-len
  const inputPoint = getCoords(input, portRefs, nodeRefs);
  /* eslint-disable max-len */
  const classList = useMemo(() => classNames('bi-diagram-link', { 'readonly-link': link.readonly }, link.className), [link.readonly, link.className]);
  const outputPoint = getCoords(output, portRefs, nodeRefs);
  /* eslint-enable max-len */
  const pathOptions = {
    type: (input.type === 'port' || output.type === 'port') ? 'bezier' : 'curve',
    inputAlignment: input.entity.alignment || null,
    outputAlignment: output.entity.alignment || null,
  };
  const path = useMemo(() => makeSvgPath(inputPoint, outputPoint, pathOptions), [inputPoint, outputPoint]);
  const labelPosition = useMemo(() => getLabelPosition(path), [path]);

  // on link delete
  const onDoubleClick = useCallback(() => {
    if (onDelete && !link.readonly) {
      onDelete(link);
    }
  }, [link.readonly, onDelete]);

  return (
    <g className={classList}>
      {!link.readonly && (<path d={path} className="bi-link-ghost" onDoubleClick={onDoubleClick} />)}
      <path d={path} ref={pathRef} className="bi-link-path" onDoubleClick={onDoubleClick} />
      {link.label && labelPosition && (<LinkLabel position={labelPosition} label={link.label} />)}
    </g>
  );
};

const InvolvedEntity = PropTypes.exact({
  type: PropTypes.oneOf(['node', 'port']),
  entity: PropTypes.oneOfType([PortType, NodeType]),
});

Link.propTypes = {
  link: LinkType.isRequired,
  input: InvolvedEntity.isRequired,
  output: InvolvedEntity.isRequired,
  onDelete: PropTypes.func,
};

Link.defaultProps = {
  onDelete: undefined,
};

export default React.memo(Link);
