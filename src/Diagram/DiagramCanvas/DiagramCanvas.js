import React, { useEffect, useRef, useState } from 'react';
import { useWindowScroll, useWindowResize } from 'beautiful-react-hooks';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DiagramContext from '../../Context/DiagramContext';

function getBBoxValues(bbox) {
  const { x, y, width, height, top, right, bottom, left } = bbox;

  return { x, y, width, height, top, right, bottom, left };
}

/**
 * The DiagramCanvas component provides a context to the Diagram children.
 * The context contains the canvas bounding box (for future calculations) and the port references in order to
 * allow links to easily access to a the ports coordinates
 */
const DiagramCanvas = (props) => {
  const { children, portRefs, nodeRefs, className, containerEl, ...rest } = props;
  const [bbox, setBoundingBox] = useState(null);
  const canvasRef = useRef();
  const classList = classNames('bi bi-diagram', className);

  // calculate the given element bounding box and save it into the bbox state
  const calculateBBox = (el) => {
    if (el) {
      const nextBBox = getBBoxValues(el.getBoundingClientRect());
      const { scrollLeft, scrollTop } = containerEl;

      if (!isEqual(nextBBox, bbox)) {
        setBoundingBox({ ...nextBBox, scrollLeft, scrollTop });
      }
    }
  };

  const calculateScrollPos = (el) => {
    if (el) {
      const { scrollLeft, scrollTop } = el;

      setBoundingBox((nextBBox) => ({ ...nextBBox, scrollLeft, scrollTop }));
    }
  };

  useEffect(() => {
    if (containerEl != null) {
      const listener = () => {
        calculateScrollPos(containerEl);
      };
      containerEl.addEventListener('scroll', listener, false);

      return () => containerEl.removeEventListener('scroll', listener);
    }
    return () => null;
  }, [containerEl]);

  // when the canvas is ready and placed within the DOM, save its bounding box to be provided down
  // to children component as a context value for future calculations.
  useEffect(() => calculateBBox(canvasRef.current), [canvasRef.current]);
  // same on window scroll and resize
  useWindowScroll(() => calculateBBox(canvasRef.current));
  useWindowResize(() => calculateBBox(canvasRef.current));

  return (
    <div className={classList} ref={canvasRef} {...rest}>
      <div className="bi-diagram-canvas">
        <DiagramContext.Provider value={{ canvas: bbox, ports: portRefs, nodes: nodeRefs, _nodes: {} }}>
          {children}
        </DiagramContext.Provider>
      </div>
    </div>
  );
};

DiagramCanvas.propTypes = {
  portRefs: PropTypes.shape({}),
  nodeRefs: PropTypes.shape({}),
  className: PropTypes.string,
  containerEl: PropTypes.instanceOf(HTMLElement),
};

DiagramCanvas.defaultProps = {
  portRefs: {},
  nodeRefs: {},
  className: '',
  containerEl: undefined,
};

export default React.memo(DiagramCanvas);
