/**
 * Return the coordinates of a given entity (node or port)
 */
// eslint-disable-next-line max-len
const getEntityCoordinates = (entity, portRefs, nodeRefs) => {
  if (entity && entity.type === 'node' && nodeRefs[entity.entity.id]) {
    const nodeEl = nodeRefs[entity.entity.id];
    const { clientWidth, clientHeight } = nodeEl;

    return [entity.entity.coordinates[0] + (clientWidth / 2), entity.entity.coordinates[1] + (clientHeight / 2)];
  }

  if (portRefs && portRefs[entity.entity.id]) {
    const { portEl, coordinates, alignment } = portRefs[entity.entity.id];
    const { clientWidth, clientHeight, offsetTop, offsetLeft } = portEl;
    // eslint-disable-next-line max-len
    const leftOffset = alignment === 'right' ? clientWidth : 0;
    return [coordinates[0] + offsetLeft + leftOffset, coordinates[1] + offsetTop + (clientHeight / 2)];
  }

  return undefined;
};

export default getEntityCoordinates;
