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
    const { portEl, coordinates } = portRefs[entity.entity.id];
    const { clientWidth, clientHeight, offsetTop, offsetLeft } = portEl;
    // eslint-disable-next-line max-len
    return [coordinates[0] + offsetLeft + (clientWidth / 2), coordinates[1] + offsetTop + (clientHeight / 2)];
  }

  return undefined;
};

export default getEntityCoordinates;
